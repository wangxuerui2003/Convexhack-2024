import Cards from "@/components/cards";

const Tasks = () => {

  return (
    <div className="mx-auto p-4 flex justify-center bg-green-100">
      <div>
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight text-black py-10 text-center">Tasks On-hand ✔️</h1>
        <div className="grid grid-cols-3 gap-3">
            <Cards />
            <Cards />
            <Cards />                        


          </div>        
      </div>
    </div>
    
  );
};

export default Tasks;