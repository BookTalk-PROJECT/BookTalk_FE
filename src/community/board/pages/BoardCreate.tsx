import CreateBoard from "../../../common/component/Board/page/CreateBoard";

const BoardCreate: React.FC = () => {
  return (
    <CreateBoard
      createPost={(data) => {
        alert(data.title);
      }}
    />
  );
};

export default BoardCreate;
