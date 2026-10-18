import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from 'components/Layout';
import styles from './Project8.module.sass';
import Header from 'components/Header';
import HeaderProject from 'components/HeaderProject';
import LinkNextProject from 'components/LinkNextProject';
import ModalImage, { ModalImageItem } from 'components/ModalImage';

const ortoleImages: ModalImageItem[] = [
  {
    src: 'images/ortole-packshot/ortole-packshot-ethan-piboyeux-01.jpg',
    alt: 'Direction artistique, shooting packshot photo et vidéo pour la mise en avant de collection de lunettes pour Ortolé Designer (Tropical Optic Shop), réalisé par Ethan Piboyeux.',
  },
  {
    src: 'images/ortole-packshot/ortole-packshot-ethan-piboyeux-02.jpg',
    alt: 'Direction artistique, shooting packshot photo et vidéo pour la mise en avant de collection de lunettes pour Ortolé Designer (Tropical Optic Shop), réalisé par Ethan Piboyeux.',
  },
  {
    src: 'images/ortole-packshot/ortole-packshot-ethan-piboyeux-03.jpg',
    alt: 'Direction artistique, shooting packshot photo et vidéo pour la mise en avant de collection de lunettes pour Ortolé Designer (Tropical Optic Shop), réalisé par Ethan Piboyeux.',
  },
  {
    src: 'images/ortole-packshot/ortole-packshot-ethan-piboyeux-04.jpg',
    alt: 'Direction artistique, shooting packshot photo et vidéo pour la mise en avant de collection de lunettes pour Ortolé Designer (Tropical Optic Shop), réalisé par Ethan Piboyeux.',
  },
  {
    src: 'images/ortole-packshot/ortole-packshot-ethan-piboyeux-05.jpg',
    alt: 'Direction artistique, shooting packshot photo et vidéo pour la mise en avant de collection de lunettes pour Ortolé Designer (Tropical Optic Shop), réalisé par Ethan Piboyeux.',
  },
  {
    src: 'images/ortole-packshot/ortole-packshot-ethan-piboyeux-06.jpg',
    alt: 'Direction artistique, shooting packshot photo et vidéo pour la mise en avant de collection de lunettes pour Ortolé Designer (Tropical Optic Shop), réalisé par Ethan Piboyeux.',
  },
  {
    src: 'images/ortole-packshot/ortole-packshot-ethan-piboyeux-07.jpg',
    alt: 'Direction artistique, shooting packshot photo et vidéo pour la mise en avant de collection de lunettes pour Ortolé Designer (Tropical Optic Shop), réalisé par Ethan Piboyeux.',
  },
  {
    src: 'images/ortole-packshot/ortole-packshot-ethan-piboyeux-08.jpg',
    alt: 'Direction artistique, shooting packshot photo et vidéo pour la mise en avant de collection de lunettes pour Ortolé Designer (Tropical Optic Shop), réalisé par Ethan Piboyeux.',
  },
];

const Project8 = (): JSX.Element => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Modal slide state
  const [modalIndex, setModalIndex] = useState<number>(0);
  const [displayModal, setDisplayModal] = useState<boolean>(false);

  // Mở modal slide từ ảnh được click
  const handleOpenModal = (index: number) => {
    setModalIndex(index);
    setDisplayModal(true);
  };

  return (
    <Layout>
      <Helmet>
        <title>THANH TÂN | Ortolé Designer (Packshot)</title>
        <meta
          name="description"
          content="Direction artistique, shooting packshot photo et vidéo pour la mise en avant de collection de lunettes pour Ortolé Designer (Tropical Optic Shop), réalisé par Ethan Piboyeux."
        />
      </Helmet>

      {/* Modal slide auto-play, desktop prev/next buttons, mobile swipe */}
      <ModalImage
        images={ortoleImages}
        initialIndex={modalIndex}
        display={displayModal}
        autoPlay={true}
        autoPlayInterval={3500}
        onClose={() => setDisplayModal(false)}
      />

      <Header url="/ortole-designer-packshot" />
      <div className={styles.container}>
        <HeaderProject
          title="ortole"
          index={1}
          titleLink="Découvrir la marque"
          link="https://ortole.com/"
          year={2021}
          services={['Direction artistique', 'Shooting Photo & Vidéo']}
        />

        <div className={styles.images__container}>
          <video
            className={styles.animation__transform_top}
            controls
            controlsList="nodownload"
            poster="images/ortole-packshot/ortole-packshot-ethan-piboyeux-miniature.jpg"
          >
            <source src="images/ortole-packshot/ortole-packshot.mp4" type="video/mp4" />
          </video>

          <div className={`${styles.row} ${styles.animation__transform_top}`}>
            <img
              src={ortoleImages[0].src}
              alt={ortoleImages[0].alt}
              onClick={() => handleOpenModal(0)}
            />
            <img
              src={ortoleImages[1].src}
              alt={ortoleImages[1].alt}
              onClick={() => handleOpenModal(1)}
            />
          </div>

          <div className={`${styles.row} ${styles.animation__transform_top}`}>
            <img
              src={ortoleImages[2].src}
              alt={ortoleImages[2].alt}
              onClick={() => handleOpenModal(2)}
            />
            <img
              src={ortoleImages[3].src}
              alt={ortoleImages[3].alt}
              onClick={() => handleOpenModal(3)}
            />
          </div>

          <div className={`${styles.row} ${styles.animation__transform_top}`}>
            <img
              src={ortoleImages[4].src}
              alt={ortoleImages[4].alt}
              onClick={() => handleOpenModal(4)}
            />
            <img
              src={ortoleImages[5].src}
              alt={ortoleImages[5].alt}
              onClick={() => handleOpenModal(5)}
            />
          </div>

          <div className={`${styles.row} ${styles.animation__transform_top}`}>
            <img
              src={ortoleImages[6].src}
              alt={ortoleImages[6].alt}
              onClick={() => handleOpenModal(6)}
            />
            <img
              src={ortoleImages[7].src}
              alt={ortoleImages[7].alt}
              onClick={() => handleOpenModal(7)}
            />
          </div>
        </div>

        <div className={styles.footer__project}>
          <div className={styles.animation__background}>
            <LinkNextProject text="9 MILLI" link="/9-milli" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Project8;
