import { useParams } from "react-router";
// import { useAuth } from "../../Contexts/AuthContext";

function RoomPage() {
  // const { user } = useAuth();
  const params = useParams();
  console.log(params);

  // const { id } = user;

  return <div>room page id : {params.id}</div>;
}

export default RoomPage;
