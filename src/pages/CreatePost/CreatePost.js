import styles from './CreatePost.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthValue } from '../../context/AuthContext';
import loadingGif from '../images/loading.gif';
import { useInsertDocument } from '../../hooks/useInsertDocument';

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState([]);
  const [formError, setFormError] = useState("");
  const {insertDocument, response} = useInsertDocument("posts");
  const navigate = useNavigate();
  const {user} = useAuthValue();

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    try {
      new URL(image);
    } catch (error) {
      setFormError("A imagem precisa ser uma URL.");
    }

    const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());

    if(!title || !image || tags || !body) {
      setFormError("Por favor, preencha todos os campos.");
    };

    if(formError) return;

    insertDocument({
      title,
      image,
      body,
      tagsArray,
      uid: user.uid,
      createdBy: user.displayName
    });

    navigate("/");
  };

  return (
    <div className={styles.create_post}>
        <h2>Criar publicação</h2>
        <p>Escreva sobre o que quiser e compartilhe o seu conhecimento!</p>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Título</span>
            <input type="text" name='title' placeholder='Digite o título.' onChange={(e) => setTitle(e.target.value)} value={title} required />
          </label>
          <label>
            <span>URL da imagem</span>
            <input type="text" name='image' placeholder='Digite a URL da imagem.' onChange={(e) => setImage(e.target.value)} value={image} required />
          </label>
          <label>
            <span>Conteúdo</span>
            <textarea name="body" placeholder='Digite o conteúdo da publicação.' onChange={(e) => setBody(e.target.value)} value={body} required></textarea>
          </label>
          <label>
            <span>Tag(s)</span>
            <input type="text" name='tags' placeholder='Digite tags para sua publicação, Ex. Viagem, Verão, Alegria.' onChange={(e) => setTags(e.target.value)} value={tags} required />
          </label>
          {!response.loading && <button className='btn'>Postar</button>}
          {response.loading && <img src={loadingGif} alt='Carregando...'/>}
          {response.error && <p className='error'>{response.error}</p>}
          {formError && <p className='error'>{formError}</p>}
        </form>
    </div>
  );
}

export default CreatePost;