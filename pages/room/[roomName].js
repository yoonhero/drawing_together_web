import { useRouter } from "next/router";

const Room = () => {
  const router = useRouter();
  const { roomName } = router.query;

  return <p>Post: {roomName}</p>;
};

export default Room;
