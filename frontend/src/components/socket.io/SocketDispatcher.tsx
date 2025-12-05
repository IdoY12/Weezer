import { useEffect, useState, type PropsWithChildren } from "react";
import { io } from "socket.io-client";
import { v4 } from "uuid";
import { useAppDispatcher } from "../../redux/hooks";
import useUserId from "../../hooks/use-user-id";
import SocketDispatcherContext from "./SocketDispatcherContext";
import SocketMessages from "socket-enums-idoyahav";
import { newPost, newComment as profileNewComment } from "../../redux/profile-slice";
import { newComment as feedNewComment, indicateNewContentAvailable } from "../../redux/feed-slice";
import { newFollower, followerRemoved } from "../../redux/followers-slice";
import { follow, unfollow } from "../../redux/following-slice";

export default function SocketDispatcher(props: PropsWithChildren) {
    const dispatch = useAppDispatcher();
    const userId = useUserId();
    const [clientId] = useState<string>(v4());

    useEffect(() => {
        const socket = io(import.meta.env.VITE_IO_SERVER_URL);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socket.onAny((eventName: string, payload: any) => {
            if (payload.from === clientId) return;

            switch (eventName) {
                case SocketMessages.NewPost:
                    dispatch(indicateNewContentAvailable());
                    if (payload.post.userId === userId) {
                        dispatch(newPost(payload.post));
                    }
                    break;

                case SocketMessages.NewFollow:
                    if (userId === payload.followee.id) {
                        dispatch(newFollower(payload.follower));
                    } else if (userId === payload.follower.id) {
                        dispatch(follow(payload.followee));
                    }
                    break;

                case SocketMessages.NewUnfollow:
                    if (userId === payload.followee.id) {
                        dispatch(followerRemoved(payload.follower.id));
                    }
                    if (userId === payload.follower.id) {
                        dispatch(unfollow(payload.followee.id));
                    }
                    break;

                case SocketMessages.NewComment:
                    dispatch(profileNewComment(payload.newComment));
                    dispatch(feedNewComment(payload.newComment));
                    break;
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [dispatch, userId, clientId]);

    const { children } = props;

    return (
        <SocketDispatcherContext.Provider value={{ clientId }}>
            {children}
        </SocketDispatcherContext.Provider>
    );
}