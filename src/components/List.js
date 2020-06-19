import React, { createRef } from 'react';

const List = (props) => {
  const renderFeatures = () => {
      const render = props.restaurantes.map(restaurante => {
        const { branch_id, name, company_name, address, hours } = restaurante.properties;
        const horario = JSON.parse(hours);
        const { coordinates } = restaurante.geometry;
        return (
        <button
          key={branch_id}
          onClick={() => props.flyTo(coordinates)}
          className="focus:outline-none border-solid border border-gray-600 flex flex-col p-4 rounded text-white m-4 justify-start focus:bg-gray-800 hover:bg-gray-800 focus:border-blue-500">
          <div class="flex flex-row w-full align-center justify-between">
            <div class="text-xl font-bold text-gray-100">{`${company_name} `}</div>
            <div class="text-gray-100">{name}</div>
          </div>
          <div class="flex text-gray-100 w-full">
              { address }
          </div>
          <div class="flex text-gray-100 w-full text-sm">
            {horario.map((hour, index) => (<span key={`${branch_id}_${index}`}>{`${hour.start_hour} - ${hour.end_hour}`}</span>))}
          </div>
        </button>);
      });
      return render;
    };
  return (<div className="flex flex-col flex-1 w-full overflow-y-auto py-1 px-3">
    {renderFeatures()}
  </div>);
}

export default List;