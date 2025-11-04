import { FadeLoader } from "react-spinners";
import './Loading.css'; 

const Loading = ()=> {

  return (
    <div className="loading__container">
      <FadeLoader color="#1CB0F6" height={15} width={5} />
    </div>
    );  
 
}

export default Loading;
