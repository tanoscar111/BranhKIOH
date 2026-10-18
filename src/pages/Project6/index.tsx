import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from 'components/Layout';
import styles from './Project6.module.sass';
import Header from 'components/Header';
import HeaderProject from 'components/HeaderProject';
import LinkNextProject from 'components/LinkNextProject';
import Credits from 'components/Credits';
import ModalImage, { ModalImageItem } from 'components/ModalImage';

const projectImages: ModalImageItem[] = [
  {
    src: 'images/9-milli/9-milli-ethan-piboyeux-2.jpg',
    alt: 'Réalisation du film (music video) de Galaburdy pour le single 9 MILLI.',
  },
  {
    src: 'images/9-milli/9-milli-ethan-piboyeux-3.jpg',
    alt: 'Réalisation du film (music video) de Galaburdy pour le single 9 MILLI.',
  },
  {
    src: 'images/9-milli/9-milli-ethan-piboyeux-4.jpg',
    alt: 'Réalisation du film (music video) de Galaburdy pour le single 9 MILLI.',
  },
  {
    src: 'images/9-milli/9-milli-ethan-piboyeux-5.jpg',
    alt: 'Réalisation du film (music video) de Galaburdy pour le single 9 MILLI.',
  },
];

const Project6 = (): JSX.Element => {
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
        <title>THANH TÂN | 9 MILLI</title>
        <meta
          name="description"
          content="Réalisation du film (music video) de Galaburdy pour le single 9 MILLI."
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

      <Header url="/9-milli" />
      <div className={styles.container}>
        <HeaderProject
          title="9 MILLI"
          index={6}
          titleLink="Voir la vidéo"
          link="https://www.youtube.com/watch?v=o93or-wdENU"
          year={2021}
          services={['Réalisation vidéo', 'Direction artistique', 'Montage vidéo']}
        />

        <div className={styles.images__container}>
          <video
            className={styles.animation__transform_top}
            controls
            controlsList="nodownload"
            poster="images/9-milli/9-milli-ethan-piboyeux-miniature.jpg"
          >
            <source src="images/9-milli/galaburdy-9mm.mp4" type="video/mp4" />
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
          <Credits
            credits={[
              {
                name: 'Ethan Piboyeux',
                role: 'Réalisateur, Scénario, Montage, VFX, GFX',
              },
              {
                name: 'Maël Aurensan',
                role: 'Scénario',
              },
              {
                name: 'C Production',
                role: 'Production',
              },
              {
                name: 'Victor Hernandez',
                role: 'Producteur exe, Drone, SFX',
              },
              {
                name: 'Marc Lacault',
                role: 'Ingénieur du son, Sound design, Mix',
              },
              {
                name: 'Antoine Poulet',
                role: 'Étalonneur',
              },
              {
                name: 'Julien Mercier',
                role: 'Cadreur, Électricien',
              },
              {
                name: 'Galaburdy',
                role: 'Artiste',
              },
            ]}
          />

          <div className={styles.animation__background}>
            <LinkNextProject text="Ortolé" link="/ortole-designer-packshot" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Project6;
