import { useEffect, useState } from "react";
import { getHelloMsg } from "../api/dashboard";

const DashBoardPage = () => {
    const [hello, setHello] = useState("");

    useEffect(() => {
        getHelloMsg().then((res) => setHello(res.msg));
    }, [])

    return (
        <div>
            <p>{hello}</p>
        </div>
    )
}

export default DashBoardPage;