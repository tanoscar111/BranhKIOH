import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from 'components/Layout';
import styles from './Project2.module.sass';
import Header from 'components/Header';
import HeaderProject from 'components/HeaderProject';
import LinkNextProject from 'components/LinkNextProject';
import Credits from 'components/Credits';
import ModalImage, { ModalImageItem } from 'components/ModalImage';

const projectImages: ModalImageItem[] = [
  {
    src: 'images/mode/lycan-mode-ethan-piboyeux-2.jpg',
    alt: "Design Graphique de la pochette (cover) du single 'Mode' de l'artiste Lycan, réalisé par Ethan Piboyeux.",
  },
  {
    src: 'images/mode/lycan-mode-ethan-piboyeux-3.jpg',
    alt: "Design Graphique de la pochette (cover) du single 'Mode' de l'artiste Lycan, réalisé par Ethan Piboyeux.",
  },
  {
    src: 'images/mode/lycan-mode-ethan-piboyeux-4.jpg',
    alt: "Design Graphique de la pochette (cover) du single 'Mode' de l'artiste Lycan, réalisé par Ethan Piboyeux.",
  },
  {
    src: 'images/mode/lycan-mode-ethan-piboyeux-5.jpg',
    alt: "Design Graphique de la pochette (cover) du single 'Mode' de l'artiste Lycan, réalisé par Ethan Piboyeux.",
  },
];

const Project2 = (): JSX.Element => {
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
        <title>THANH TÂN | Mode</title>
        <meta
          name="description"
          content="Design Graphique de la pochette (cover) du single « Mode » de l'artiste Lycan, réalisé par Ethan Piboyeux."
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

      <Header url="/mode" />
      <div className={styles.container}>
        <HeaderProject
          title="Mode"
          index={2}
          titleLink="Écouter le single"
          link="https://open.spotify.com/track/3Cdho3oYoyHUKLvd06s2Uw?si=8144267fd9914bac"
          year={2021}
          services={['Direction artistique', 'Design graphique']}
        />

        <div className={styles.images__container}>
          <img
            className={styles.animation__transform_top}
            src={projectImages[0].src}
            alt={projectImages[0].alt}
            onClick={() => handleOpenModal(0)}
          />
          <div className={`${styles.row} ${styles.animation__transform_top}`}>
            <img
              src={projectImages[1].src}
              alt={projectImages[1].alt}
              onClick={() => handleOpenModal(1)}
            />
            <img
              src={projectImages[2].src}
              alt={projectImages[2].alt}
              onClick={() => handleOpenModal(2)}
            />
          </div>
          <img
            className={styles.animation__transform_top}
            src={projectImages[3].src}
            alt={projectImages[3].alt}
            onClick={() => handleOpenModal(3)}
          />
        </div>

        <div className={styles.footer__project}>
          <div>
            <Credits
              credits={[
                {
                  name: 'François Grenier',
                  role: 'Peintre',
                },
                {
                  name: 'Antony Lycan',
                  role: 'Artiste',
                },
              ]}
            />
            <div className={styles.animation__background}>
              <LinkNextProject text="Youv Dee" link="/youv-dee" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Project2;
