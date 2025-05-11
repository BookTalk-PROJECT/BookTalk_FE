import CreateBoard from "../../../common/component/CreateBoard";

const CreateBoardPage: React.FC = () => {

    return(
        <CreateBoard
            postBoard={(data) => {alert(data.title)}}
        />
    )
}

export default CreateBoardPage;