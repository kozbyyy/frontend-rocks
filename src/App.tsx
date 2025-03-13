import { useEffect, useState } from "react";
import { UNSAFE_DataWithResponseInit } from "react-router";
import { PokeAPI } from "./pokeapiClient";
import { setDefaultAutoSelectFamily } from "net";


async function fetchData(): Promise<CardProps[]> {
  const data = await PokeAPI.getPokemonsList();
  const pokemons = await Promise.all(
    data.results.map((pokemon) =>{
      return PokeAPI.getPokemonByName(pokemon.name);
    })
  );
  
  return pokemons.map((pokemon) => {
    return{
    id: pokemon.id,
    name: pokemon.name,
    image: pokemon.sprites.other["official-artwork"].front_shiny ?? "",
    types: pokemon.types.map((t) => t.type.name),
    };
  });
}
const typeColors: { [key: string]: string} ={
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  poison: "bg-purple-500",
};

function getColor (type: string) {
  return typeColors[type];
}
interface CardProps {
  id: number;
  name: string;
  image: string;
  types: string[];
}

const Card = (props: CardProps) => {
return(
<div className="bg-white w-3xs rounded-2xl">
          {props.id} - {props.name}
          <img src={props.image}/>
          <div className="justify-end flex flex-wrap gap-4">
          {props.types.map((type) => {
            return (
              <div className={`rounded-2xl p-4 ${getColor(type)}`}>{type}</div>
            )
          }
          )}</div>
        </div>)
}

export const App = () => {
const [data, setData] = useState<CardProps[]>([]);
  useEffect(() => {  
  fetchData().then((result) => {
    setData(
      result.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        types: item.types,
      }))
    );
  });
  }, []);
  return  (
    <div>
      <div className="flex flex-wrap gap-4 p-4">
        {data.map((item) => {
      return <Card 
      id={item.id}
      name={item.name}
      image={item.image} 
      types={item.types}
      />
    })}
    </div>
    </div>
  )
}

export const Detail = () => {
  return null
}