import { useNavigate } from 'react-router-dom';
import type PostModel from '../../../models/post';
import './Post.css';
import PostComments from '../comments/post-comments/PostComments';
import { useAppDispatcher } from '../../../redux/hooks';
import { deletePost } from '../../../redux/profile-slice';
import useService from '../../../hooks/use-service';
import ProfileService from '../../../services/auth-aware/ProfileService';
import getImageUrl from '../../../hooks/use-image';
import ProfilePicture from '../../common/profile-picture/ProfilePicture';

interface PostProps {
    post: PostModel,
    isEditAllowed: boolean,
    isNew?: boolean
}

export default function Post(props: PostProps) {

    const {
        title,
        createdAt,
        user,
        body,
        id,
        imageUrl,
        comments
    } = props.post;

    const { name } = user;

    const { isEditAllowed, isNew } = props;

    const navigate = useNavigate();

    const dispatch = useAppDispatcher();

    const profileService = useService(ProfileService);

    async function removeMe() {
        try {
            if (confirm('are you sure?')) {
                await profileService.remove(id);
                dispatch(deletePost(id));
            }
        } catch (e) {
            alert(e);
        }
    }

    function editMe() {
        navigate(`/profile/edit/${id}`);
    }

    const image = imageUrl ? getImageUrl(imageUrl) : '';

    const className = `Post ${isNew ? 'new-post' : ''}`;

    return (
        <div className={className}>
            <div><h3>{title}</h3></div>
            <div className="post-author">
                <ProfilePicture user={user} size={32} />
                <span>{(new Date(createdAt)).toLocaleDateString()} by {name}</span>
            </div>
            <div>{body}</div>
            {image && <div><img src={`${image}`} /></div>}
            {/* conditional rendering (render something depending on a boolean value):  */}
            {isEditAllowed && <div>
                <button onClick={removeMe}>Delete</button><button onClick={editMe}>Edit</button>
            </div>}

            <PostComments
                comments={comments}
                postId={id}
            />


        </div>
    );
}