import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from 'components/Layout';
import styles from './Project4.module.sass';
import Header from 'components/Header';
import HeaderProject from 'components/HeaderProject';
import LinkNextProject from 'components/LinkNextProject';
import Credits from 'components/Credits';
import ModalImage, { ModalImageItem } from 'components/ModalImage';

const projectImages: ModalImageItem[] = [
  {
    src: 'images/trieste/trieste-ethan-piboyeux-4.jpg',
    alt: 'Trieste est un projet de site interactif et artistique en collaboration avec le musée des Beaux-Arts de Bordeaux dans le cadre de la Bacchaweek.',
  },
  {
    src: 'images/trieste/trieste-ethan-piboyeux-7.jpg',
    alt: 'Trieste est un projet de site interactif et artistique en collaboration avec le musée des Beaux-Arts de Bordeaux dans le cadre de la Bacchaweek.',
  },
  {
    src: 'images/trieste/trieste-ethan-piboyeux-6.jpg',
    alt: 'Trieste est un projet de site interactif et artistique en collaboration với le musée des Beaux-Arts de Bordeaux dans le cadre de la Bacchaweek.',
  },
  {
    src: 'images/trieste/trieste-ethan-piboyeux-5.jpg',
    alt: 'Trieste est un projet de site interactif et artistique en collaboration avec le musée des Beaux-Arts de Bordeaux dans le cadre de la Bacchaweek.',
  },
  {
    src: 'images/trieste/trieste-ethan-piboyeux-2.jpg',
    alt: 'Trieste est un projet de site interactif et artistique en collaboration avec le musée des Beaux-Arts de Bordeaux dans le cadre de la Bacchaweek.',
  },
  {
    src: 'images/trieste/trieste-ethan-piboyeux-3.jpg',
    alt: 'Trieste est un projet de site interactif et artistique en collaboration avec le musée des Beaux-Arts de Bordeaux dans le cadre de la Bacchaweek.',
  },
];

const Project4 = (): JSX.Element => {
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
        <title>THANH TÂN | Trieste</title>
        <meta
          name="description"
          content="Trieste est un projet de site interactif et artistique en collaboration avec le musée des Beaux-Arts de Bordeaux dans le cadre de la Bacchaweek."
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

      <Header url="/trieste" />
      <div className={styles.container}>
        <HeaderProject
          title="Trieste"
          index={4}
          titleLink="Découvrir le projet"
          link="http://trieste.marclacault.fr/"
          year={2021}
          services={['Direction artistique', 'Design graphique', 'Écriture de scénario']}
        />

        <p className={`${styles.text__introduction} ${styles.animation__transform_top}`}>
          Trieste est un projet de site interactif et artistique en collaboration avec le musée des
          Beaux-Arts de Bordeaux dans le cadre de la Bacchaweek.
        </p>

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
          <div className={`${styles.row} ${styles.animation__transform_top}`}>
            <img
              src={projectImages[4].src}
              alt={projectImages[4].alt}
              onClick={() => handleOpenModal(4)}
            />
            <img
              src={projectImages[5].src}
              alt={projectImages[5].alt}
              onClick={() => handleOpenModal(5)}
            />
          </div>
        </div>

        <div className={styles.footer__project}>
          <div>
            <Credits
              credits={[
                {
                  name: 'Enzo Arnaudet',
                  role: 'Motion design, Écriture',
                },
                {
                  name: 'Mathieu Delepine',
                  role: 'Écriture, Motion design',
                },
                {
                  name: 'Tristan Guillemot',
                  role: 'Développeur web',
                },
                {
                  name: 'Mael Aurensan',
                  role: 'Développeur web, 3D',
                },
                {
                  name: 'Marc Lacault',
                  role: 'Sound design, Écriture',
                },
              ]}
            />

            <div className={styles.animation__background}>
              <LinkNextProject text="Kleidi" link="/kleidi" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Project4;
