import { 
  ClipLoader, 
  BounceLoader, 
  CircleLoader, 
  DotLoader, 
  FadeLoader, 
  GridLoader, 
  HashLoader, 
  MoonLoader, 
  PacmanLoader, 
  PropagateLoader, 
  PuffLoader, 
  PulseLoader, 
  RingLoader, 
  RiseLoader, 
  RotateLoader, 
  ScaleLoader, 
  SkewLoader, 
  SquareLoader, 
  SyncLoader 
} from "react-spinners";
import './Loading.css'; // Add this import

const Loading = ()=> {
  const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' };

  // Option 1 - ClipLoader (original) -
//   return <ClipLoader color="#1CB0F6" size={50} />;
  
  // Option 2 - BounceLoader (current active) **
//   return (
//     <div style={containerStyle}>
//       <BounceLoader color="#1CB0F6" size={60} />
//     </div>
//   );
  
  // Option 3 - CircleLoader
//   return <div style={containerStyle}><CircleLoader color="#1CB0F6" size={50} /></div>;
  
  // Option 4 - DotLoader
//   return <div style={containerStyle}><DotLoader color="#1CB0F6" size={50} /></div>;
  
  // Option 5 - FadeLoader ***
  return (
    <div className="loading__container">
      <FadeLoader color="#1CB0F6" height={15} width={5} />
    </div>
    );  
  // Option 6 - GridLoader
//   return <div style={containerStyle}><GridLoader color="#1CB0F6" size={15} /></div>;
  
  // Option 7 - HashLoader
//   return <div style={containerStyle}><HashLoader color="#1CB0F6" size={50} /></div>;
  
  // Option 8 - MoonLoader
//   return <div style={containerStyle}><MoonLoader color="#1CB0F6" size={30} /></div>;
  
  // Option 9 - PacmanLoader ***
//   return <div style={containerStyle}><PacmanLoader color="#1CB0F6" size={25} /></div>;
  
  // Option 10 - PropagateLoader
//   return <div style={containerStyle}><PropagateLoader color="#1CB0F6" size={15} /></div>;
  
  // Option 11 - PuffLoader ***
//   return <div style={containerStyle}><PuffLoader color="#1CB0F6" size={60} /></div>;
  
  // Option 12 - PulseLoader
//   return <div style={containerStyle}><PulseLoader color="#1CB0F6" size={15} /></div>;
  
  // Option 13 - RingLoader
//   return <div style={containerStyle}><RingLoader color="#1CB0F6" size={60} /></div>;
  
  // Option 14 - RiseLoader
//   return <div style={containerStyle}><RiseLoader color="#1CB0F6" size={15} /></div>;
  
  // Option 15 - RotateLoader **
//   return <div style={containerStyle}><RotateLoader color="#1CB0F6" size={15} /></div>;
  
  // Option 16 - ScaleLoader **
//   return <div style={containerStyle}><ScaleLoader color="#1CB0F6" height={35} width={4} /></div>;
  
  // Option 17 - SkewLoader
//   return <div style={containerStyle}><SkewLoader color="#1CB0F6" size={20} /></div>;
  
  // Option 18 - SquareLoader
//   return <div style={containerStyle}><SquareLoader color="#1CB0F6" size={50} /></div>;
  
  // Option 19 - SyncLoader
//   return <div style={containerStyle}><SyncLoader color="#1CB0F6" size={15} /></div>;
}

export default Loading;
