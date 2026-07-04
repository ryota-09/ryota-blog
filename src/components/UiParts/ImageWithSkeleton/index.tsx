"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { cltw } from "@/util";

import type { ImageProps } from "next/image";

type ImageWithSkeletonProps = {
  /**
   * スケルトンのスタイルを上書きするクラス名（例: 円形画像には "rounded-full" を渡す）
   */
  skeletonClassName?: string;
  /**
   * 指定した場合、内部で position: relative な <span> を生成してラップする（inline-block）。
   * 指定しない場合、呼び出し側が画像とぴったり同じ大きさの position: relative なコンテナを用意すること。
   */
  wrapperClassName?: string;
} & ImageProps;

/**
 * next/image のロード完了(onLoad)/エラー(onError)までスケルトンを表示するラッパー。
 * スケルトンは画像の手前に重ねて表示しフェードアウトさせる方式（画像自体のopacityは操作しない）。
 * これにより priority/preload 指定のLCP対象画像にもスケルトンを適用してよく、LCP計測への悪影響がない。
 *
 * 遷移中に画像要素自体がアンマウント→リマウントされるケース（View Transition時の二重フェッチなど）でも、
 * このコンポーネントごと再マウントされ isLoaded は false から始まり直すため、
 * 最終的に成功したロードで onLoad が発火するまでスケルトンは表示され続ける。
 * また、同一インスタンスのまま src だけが差し替わるケース（将来カルーセル等で再利用される場合）に備え、
 * src の変化を検知して isLoaded を明示的にリセットする。
 *
 * 既知の制約: 初回SSR＋ハイドレーション時、ブラウザが画像を実際には表示可能な状態にしていても、
 * isLoaded は React のハイドレーションが完了し onLoad 相当の処理が走るまで false のままになる。
 * 通常の環境ではハイドレーションは数百ms以内に完了するため体感できる問題にならないが、
 * 極端に低スペックな端末やCPUが逼迫した状況ではスケルトンが数秒残る可能性がある。
 * これは「画像自体のopacityを操作しない（LCP計測に影響しない）」設計とのトレードオフであり、
 * onLoad/refコールバックのタイミングはNext.js側のハイドレーション完了に依存するため
 * このコンポーネント内だけでは解消できない（next/imageのownRefコールバックもハイドレーション後にしか走らない）。
 */
const ImageWithSkeleton = ({
  skeletonClassName = "",
  wrapperClassName,
  onLoad,
  onError,
  alt,
  src,
  ...restProps
}: ImageWithSkeletonProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  // src が差し替わった場合（同一インスタンスがキーを変えずに再利用されるケース）に
  // スケルトンを再表示できるよう、レンダー中に前回の src と比較して isLoaded を調整する
  // （React公式が推奨する「レンダー中の状態調整」パターン。useEffectだと1フレーム遅れて
  // 古い画像が一瞬見えてしまうが、この方式なら同じレンダーの中で解消できる）
  const [prevSrc, setPrevSrc] = useState(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setIsLoaded(false);
  }

  // onLoad/onError の参照を安定させる。ここをレンダーごとに新しいクロージャにすると、
  // next/image内部の ownRef が依存配列(onError等)の変化を検知してrefを再アタッチし、
  // 画像読み込み完了後の再レンダー時にも img.src の再代入(エラー検知用ワークアラウンド)が
  // 再度走ってしまい、無駄な再デコードサイクルが発生するため。
  const handleLoad = useCallback<NonNullable<ImageProps["onLoad"]>>(
    (e) => {
      setIsLoaded(true);
      onLoad?.(e);
    },
    [onLoad]
  );
  const handleError = useCallback<NonNullable<ImageProps["onError"]>>(
    (e) => {
      // エラー時もスケルトンは解除する（読み込み中のまま固まるのを防ぐ）
      setIsLoaded(true);
      onError?.(e);
    },
    [onError]
  );

  const content = (
    <>
      <Image
        {...restProps}
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
      />
      <span
        aria-hidden="true"
        className={cltw(
          "pointer-events-none absolute inset-0 bg-gray-200 transition-opacity duration-300 dark:bg-gray-600",
          isLoaded ? "opacity-0" : "animate-pulse opacity-100",
          skeletonClassName
        )}
      />
    </>
  );

  if (wrapperClassName === undefined) return content;
  return (
    <span className={cltw("relative inline-block", wrapperClassName)}>
      {content}
    </span>
  );
};

export default ImageWithSkeleton;
