'use client';

import {useState} from 'react';
import Image from 'next/image';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import styles from './ImageCarousel.module.css';

interface ImageCarouselProps {
  images: string[];
  basePath: string;
}

export default function ImageCarousel({images, basePath}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className={styles.carouselContainer}>
      <button className={`${styles.navigationButton} ${styles.leftArrow}`} onClick={goToPrevious}>
        <ChevronLeft size={16} />
      </button>
      <button className={`${styles.navigationButton} ${styles.rightArrow}`} onClick={goToNext}>
        <ChevronRight size={16} />
      </button>
      <div className={styles.imageContainer}>
        <Image
          width={800}
          height={800}
          src={`${basePath}/${images[currentIndex]}`}
          alt={`Slide ${currentIndex}`}
          className={styles.image}
          style={{maxHeight: '60vh', maxWidth: '100%'}}
        />
      </div>
    </div>
  );
}
