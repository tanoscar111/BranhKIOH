import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from 'components/Layout';
import styles from './Project3.module.sass';
import Header from 'components/Header';
import HeaderProject from 'components/HeaderProject';
import LinkNextProject from 'components/LinkNextProject';
import Credits from 'components/Credits';
import ModalImage, { ModalImageItem } from 'components/ModalImage';

const projectImages: ModalImageItem[] = [
  {
    src: 'images/youv-dee/you-dee-la-vie-de-luxe-ethan-piboyeux-1.jpg',
    alt: "Re-Design Graphique de la pochette d'album (cover) 'La Vie De Luxe' de l'artiste Youv Dee, réalisé par Ethan Piboyeux.",
  },
  {
    src: 'images/youv-dee/you-dee-la-vie-de-luxe-ethan-piboyeux-2.jpg',
    alt: "Re-Design Graphique de la pochette d'album (cover) 'La Vie De Luxe' de l'artiste Youv Dee, réalisé par Ethan Piboyeux.",
  },
  {
    src: 'images/youv-dee/you-dee-la-vie-de-luxe-ethan-piboyeux-3.jpg',
    alt: "Re-Design Graphique de la pochette d'album (cover) 'La Vie De Luxe' de l'artiste Youv Dee, réalisé par Ethan Piboyeux.",
  },
  {
    src: 'images/youv-dee/you-dee-la-vie-de-luxe-ethan-piboyeux-4.jpg',
    alt: "Re-Design Graphique de la pochette d'album (cover) 'La Vie De Luxe' de l'artiste Youv Dee, réalisé par Ethan Piboyeux.",
  },
];

const Project3 = (): JSX.Element => {
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
        <title>THANH TÂN | Youv Dee</title>
        <meta
          name="description"
          content="Re-Design Graphique de la pochette d'album (cover) « La Vie De Luxe » de l'artiste Youv Dee, réalisé par Ethan Piboyeux."
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

      <Header url="/youv-dee" />
      <div className={styles.container}>
        <HeaderProject
          title="Youv Dee"
          index={3}
          titleLink="Écouter l'album"
          link="https://open.spotify.com/playlist/3t4yLWMNFch9wLMoTRRt1S?si=50838cba63824015"
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
                  name: 'Ashwin Cazal',
                  role: 'Images',
                },
                {
                  name: 'Youv Dee',
                  role: 'Artiste',
                },
              ]}
            />

            <div className={styles.animation__background}>
              <LinkNextProject text="Trieste" link="/trieste" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Project3;
