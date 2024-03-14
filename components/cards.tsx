const Cards = (task: any) => {
  console.log(task);
  return (
    <div className='flex flex-col items-center border-gray-300 md:flex-row md:max-w-xl relative overflow-hidden rounded-lg border bg-white p-2 shadow mx-7'>
      <img
        className='rounded-t-lg h-max md:w-48 md:rounded-none md:rounded-s-lg'
        src='https://www.bpmcdn.com/f/files/fernie/import/2017-04/16531ferniefpDeadDeer.jpg'
        alt=''
      />
      <div className='flex flex-col justify-between p-4 leading-normal'>
        <h5 className='font-bold text-black '>
          {task.task.address}
        </h5>
        <div>
          <p className='text-sm text-gray-500'>
            Latitude: {task.task.location.latitude}
          </p>
          <p className='text-sm text-gray-500'>
            Longitude: {task.task.location.longitude}
          </p>
          <p className="text-xs text-gray-400 pt-5">{task.task._creationTime}</p>
        </div>
      </div>
    </div>
  );
};

export default Cards;