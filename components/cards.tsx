const Cards = () => {
    return (
        <div className="flex flex-col items-center bg-orange-500  border-4 border-white  rounded-lg shadow md:flex-row md:max-w-xl">
            <img className="rounded-t-lg h-max md:w-48 md:rounded-none md:rounded-s-lg" src="https://www.bpmcdn.com/f/files/fernie/import/2017-04/16531ferniefpDeadDeer.jpg" alt="" />
            <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-2 text-xl font-bold tracking-tight text-white ">Location: Jalan Tun Sabathan</h5>
                <p className="mb-3 font-normal text-sm text-gray-100">Coordinates: (3.1, 100.4)</p>
            </div>
        </div>
    );
}
 
export default Cards;