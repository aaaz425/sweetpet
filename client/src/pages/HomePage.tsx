import { ArrowRight, BookOpen, ClipboardList, PawPrint } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pagePaths } from "../constants";

const landingSlides = [
  {
    icon: PawPrint,
    eyebrow: "마이펫",
    title: "가장 가까운 존재를 가장 또렷하게",
    body: "반려동물의 이름, 생일, 특징을 한곳에 정리하고 함께 관리합니다.",
    image: "/landing-images/my-pet.jpg",
    alt: "집 안에서 보호자와 함께 있는 반려견",
    actionLabel: "마이펫 등록",
    actionPath: pagePaths.pets,
  },
  {
    icon: ClipboardList,
    eyebrow: "일상기록",
    title: "오늘의 표정이 내일의 이야기가 되도록",
    body: "사진, 컨디션, 메모를 날짜별로 남겨 마이펫의 일상을 차곡차곡 쌓습니다.",
    image: "/landing-images/records.jpg",
    alt: "소파 위에서 쉬고 있는 반려묘",
    actionLabel: "기록 시작",
    actionPath: pagePaths.records,
  },
  {
    icon: BookOpen,
    eyebrow: "앨범북",
    title: "쌓인 기록을 오래 남길 한 권으로",
    body: "원하는 기간의 기록을 골라 앨범북 주문 데이터로 이어갑니다.",
    image: "/landing-images/album-book.jpg",
    alt: "책과 함께 침대 위에 누워 있는 반려묘",
    actionLabel: "앨범북 주문",
    actionPath: pagePaths.albums,
  },
] as const;

const primaryLandingButtonClass =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-surface bg-text-primary/45 px-4 py-2.5 text-sm font-bold text-surface backdrop-blur-sm transition duration-150 hover:bg-text-primary/65 active:scale-[0.99]";

export function HomePage() {
  const navigate = useNavigate();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (firstEntry, secondEntry) =>
              secondEntry.intersectionRatio - firstEntry.intersectionRatio,
          )[0];

        if (!visibleEntry) return;

        const nextIndex = Number(
          visibleEntry.target.getAttribute("data-slide-index"),
        );
        if (Number.isInteger(nextIndex)) {
          setActiveSlideIndex(nextIndex);
        }
      },
      { threshold: [0.42, 0.6, 0.78] },
    );

    slideRefs.current.forEach((slideRef) => {
      if (slideRef) observer.observe(slideRef);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative left-1/2 -mt-6 grid w-screen -translate-x-1/2 md:-mt-8">
      <div className="sticky top-0 z-0 h-[calc(100dvh-76px)] min-h-[560px] overflow-hidden bg-text-primary">
        {landingSlides.map((slide, slideIndex) => (
          <img
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              activeSlideIndex === slideIndex ? "opacity-100" : "opacity-0"
            }`}
            key={slide.image}
            src={slide.image}
            alt={slide.alt}
          />
        ))}
        <div
          className="absolute inset-0 bg-text-primary/45"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 -mt-[calc(100dvh-76px)]">
        {landingSlides.map((slide, slideIndex) => {
          const SlideIcon = slide.icon;
          const HeadingTag = slideIndex === 0 ? "h1" : "h2";
          const isActiveSlide = activeSlideIndex === slideIndex;

          return (
            <article
              className="grid min-h-[calc(100dvh-76px)] min-w-0 content-center px-4 py-24 md:px-8 lg:px-[max(2rem,calc((100vw-1120px)/2+2rem))]"
              data-slide-index={slideIndex}
              key={slide.eyebrow}
              ref={(node) => {
                slideRefs.current[slideIndex] = node;
              }}
            >
              <div
                className={`grid w-full max-w-[1040px] gap-5 text-surface transition duration-500 ${
                  isActiveSlide
                    ? "translate-y-0 opacity-100"
                    : "translate-y-5 opacity-65"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-surface/90 text-primary">
                    <SlideIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="text-lg font-bold tracking-normal">
                    {slide.eyebrow}
                  </p>
                </div>

                <div className="grid gap-4">
                  <HeadingTag className="text-4xl font-bold leading-tight md:text-5xl lg:whitespace-nowrap">
                    {slide.title}
                  </HeadingTag>
                  <p className="max-w-[620px] text-base font-medium leading-7 text-surface/90 md:text-lg">
                    {slide.body}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    className={primaryLandingButtonClass}
                    onClick={() => navigate(slide.actionPath)}
                    type="button"
                  >
                    {slide.actionLabel}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div
        className="fixed bottom-5 right-5 z-20 hidden gap-2 md:flex"
        aria-label="랜딩 슬라이드 진행 상태"
      >
        {landingSlides.map((slide, slideIndex) => (
          <span
            className={`h-1.5 rounded-full bg-surface transition-all duration-200 ${
              activeSlideIndex === slideIndex
                ? "w-9 opacity-100"
                : "w-3 opacity-55"
            }`}
            key={slide.eyebrow}
          />
        ))}
      </div>
    </section>
  );
}
