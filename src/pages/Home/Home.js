import styles from './Home.module.css';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useFetchDocuments } from '../../hooks/useFetchDocuments';
import loadingGif from '../images/loading.gif';
import PostDetail from '../../components/PostDetail';


const Home = () => {
  const [query, setQuery] = useState("");
  const {documents: posts, loading} = useFetchDocuments("posts");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if(query) {
      return navigate(`/search?q=${query}`);
    }
  };

  return (
    <div className={styles.home}>
        <h1>Veja as nossas publicações mais recentes</h1>
        <form onSubmit={handleSubmit} className={styles.search_form}>
          <input type="text" placeholder='Ou busque por tags' onChange={(e) => setQuery(e.target.value)} value={query} />
          <button className="btn btn-dark">Pesquisar</button>
        </form>
        <div>
          {loading && <img src={loadingGif} alt='Carregando...'/>}
          {posts && posts.map((post) => <PostDetail post={post} key={post.id}/>)}
          {posts && posts.length === 0 && (
            <div className={styles.noposts}>
              <p>Não foram encontradas publicações.</p>
              <Link to="/posts/create" className='btn'>Criar primeira publicação</Link>
            </div>
          )}
        </div>
    </div>
  );
}

export default Home;