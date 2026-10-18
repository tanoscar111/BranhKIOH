import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from 'components/Layout';
import styles from './Project1.module.sass';
import Header from 'components/Header';
import HeaderProject from 'components/HeaderProject';
import LinkNextProject from 'components/LinkNextProject';
import ModalImage, { ModalImageItem } from 'components/ModalImage';

const projectImages: ModalImageItem[] = [
  {
    src: 'images/louis-pion/louis-pion-ethan-piboyeux-2.jpg',
    alt: 'Vidéo de présentation de produit de la Montre ACHILLE XK1491IN2-15 de louis pion, réalisé par Ethan Piboyeux.',
  },
  {
    src: 'images/louis-pion/louis-pion-ethan-piboyeux-3.jpg',
    alt: 'Vidéo de présentation de produit de la Montre ACHILLE XK1491IN2-15 de louis pion, réalisé par Ethan Piboyeux.',
  },
  {
    src: 'images/louis-pion/louis-pion-ethan-piboyeux-4.jpg',
    alt: 'Vidéo de présentation de produit de la Montre ACHILLE XK1491IN2-15 de louis pion, réalisé par Ethan Piboyeux.',
  },
  {
    src: 'images/louis-pion/louis-pion-ethan-piboyeux-5.jpg',
    alt: 'Vidéo de présentation de produit de la Montre ACHILLE XK1491IN2-15 de louis pion, réalisé par Ethan Piboyeux.',
  },
];

const Project1 = (): JSX.Element => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [modalIndex, setModalIndex] = useState<number>(0);
  const [displayModal, setDisplayModal] = useState<boolean>(false);

  const handleOpenModal = (index: number) => {
    setModalIndex(index);
    setDisplayModal(true);
  };

  return (
    <Layout>
      <Helmet>
        <title>THANH TÂN | Louis Pion</title>
        <meta
          name="description"
          content="Vidéo de présentation de produit de la Montre ACHILLE XK1491IN2-15 de louis pion, réalisé par Ethan Piboyeux."
        />
      </Helmet>

      <ModalImage
        images={projectImages}
        initialIndex={modalIndex}
        display={displayModal}
        autoPlay={true}
        autoPlayInterval={3500}
        onClose={() => setDisplayModal(false)}
      />

      <Header url="/louis-pion" />
      <div className={styles.container}>
        <HeaderProject
          title="Louis Pion"
          index={1}
          titleLink="Voir la vidéo"
          link="https://youtu.be/MK6FZHSqu68"
          year={2021}
          services={['Direction artistique', 'Production vidéo', 'Montage vidéo']}
        />

        <div className={styles.images__container}>
          <video
            className={styles.animation__transform_top}
            controls
            controlsList="nodownload"
            poster="images/louis-pion/louis-pion-ethan-piboyeux-miniature.jpg"
          >
            <source src="images/louis-pion/louis-pion-ethan-piboyeux.mp4" type="video/mp4" />
          </video>
          <div className={`${styles.row} ${styles.animation__transform_top}`}>
            <img
              src={projectImages[0].src}
              alt={projectImages[0].alt}
              onClick={() => handleOpenModal(0)}
            />
            <img
              src={projectImages[1].src}
              alt={projectImages[1].alt}
              onClick={() => handleOpenModal(1)}
            />
          </div>
          <div className={`${styles.row} ${styles.animation__transform_top}`}>
            <img
              src={projectImages[2].src}
              alt={projectImages[2].alt}
              onClick={() => handleOpenModal(2)}
            />
            <img
              src={projectImages[3].src}
              alt={projectImages[3].alt}
              onClick={() => handleOpenModal(3)}
            />
          </div>
        </div>

        <div className={styles.footer__project}>
          <div className={styles.animation__background}>
            <LinkNextProject text="Une Vie" link="/une-vie" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Project1;
