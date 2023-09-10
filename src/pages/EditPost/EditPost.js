import styles from './EditPost.module.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthValue } from '../../context/AuthContext';
import loadingGif from '../images/loading.gif';
import { useFetchDocument } from '../../hooks/useFetchDocument';
import { useUpdateDocument } from '../../hooks/useUpdateDocument';

const EditPost = () => {
  const {id} = useParams();
  const {document: post} = useFetchDocument("posts", id);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState([]);
  const [formError, setFormError] = useState("");
  const {updateDocument, response} = useUpdateDocument("posts");
  const navigate = useNavigate();
  const {user} = useAuthValue();

  useEffect(() => {
    if(post) {
        setTitle(post.title);
        setBody(post.body);
        setImage(post.image);

        const textTags = post.tagsArray.join(", ");
        setTags(textTags);
    }
  }, [post]);

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

    const data = {
      title,
      image,
      body,
      tagsArray,
      uid: user.uid,
      createdBy: user.displayName
    };

    updateDocument(id, data);

    navigate("/dashboard");
  };

  return (
    <div className={styles.edit_post}>
        {post && (
            <>
                <h2>Editar publicação: {post.title}</h2>
                <p>Altere os dados da publicação como desejar!</p>
                <form onSubmit={handleSubmit}>
                <label>
                    <span>Título</span>
                    <input type="text" name='title' placeholder='Digite o título.' onChange={(e) => setTitle(e.target.value)} value={title} required />
                </label>
                <label>
                    <span>URL da imagem</span>
                    <input type="text" name='image' placeholder='Digite a URL da imagem.' onChange={(e) => setImage(e.target.value)} value={image} required />
                </label>
                <p className={styles.preview_title}>Visualização da imagem</p>
                <img className={styles.image_preview} src={post.image} alt={post.title} />
                <label>
                    <span>Conteúdo</span>
                    <textarea name="body" placeholder='Digite o conteúdo da publicação.' onChange={(e) => setBody(e.target.value)} value={body} required></textarea>
                </label>
                <label>
                    <span>Tag(s)</span>
                    <input type="text" name='tags' placeholder='Digite tags para sua publicação, Ex. Viagem, Verão, Alegria.' onChange={(e) => setTags(e.target.value)} value={tags} required />
                </label>
                {!response.loading && <button className='btn'>Editar</button>}
                {response.loading && <img src={loadingGif} alt='Carregando...'/>}
                {response.error && <p className='error'>{response.error}</p>}
                {formError && <p className='error'>{formError}</p>}
                </form>
            </>
        )}
    </div>
  );
}

export default EditPost;