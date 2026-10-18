import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from 'components/Layout';
import styles from './Project7.module.sass';
import Header from 'components/Header';
import HeaderProject from 'components/HeaderProject';
import LinkNextProject from 'components/LinkNextProject';
import ModalImage, { ModalImageItem } from 'components/ModalImage';

const projectImages: ModalImageItem[] = [
  {
    src: 'images/une-vie/une-vie-eta-ethan-piboyeux-1.jpg',
    alt: "Design Graphique de la pochette (cover) de l'album « Une Vie » de l'artiste Eta, réalisé par Ethan Piboyeux.",
  },
  {
    src: 'images/une-vie/une-vie-eta-ethan-piboyeux-2.jpg',
    alt: "Design Graphique de la pochette (cover) de l'album « Une Vie » de l'artiste Eta, réalisé par Ethan Piboyeux.",
  },
  {
    src: 'images/une-vie/une-vie-eta-ethan-piboyeux-3.jpg',
    alt: "Design Graphique de la pochette (cover) de l'album « Une Vie » de l'artiste Eta, réalisé par Ethan Piboyeux.",
  },
  {
    src: 'images/une-vie/une-vie-eta-ethan-piboyeux-4.jpg',
    alt: "Design Graphique de la pochette (cover) de l'album « Une Vie » de l'artiste Eta, réalisé par Ethan Piboyeux.",
  },
];

const Project7 = (): JSX.Element => {
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
        <title>THANH TÂN | Une Vie</title>
        <meta
          name="description"
          content="Design Graphique de la pochette (cover) de l'album « Une Vie » de l'artiste Eta, réalisé par Ethan Piboyeux."
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

      <Header url="/une-vie" />
      <div className={styles.container}>
        <HeaderProject
          title="Une Vie"
          index={7}
          titleLink="Écouter l'album"
          link="https://open.spotify.com/album/43Y6t2eG1qU5g5u88P9yqY?si=t97a_030Q76B20fC1Xb-Sw"
          year={2021}
          services={['Direction artistique', 'Design graphique']}
        />

        <div className={styles.images__container}>
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
            <LinkNextProject text="Mode" link="/mode" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Project7;
