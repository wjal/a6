import Link from 'next/link';
import { Button, Card } from 'react-bootstrap';
import useSWR from 'swr';
import Error from 'next/error';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { useState } from 'react';
import { useEffect } from 'react';
import { addToFavourites, removeFromFavourites } from '@/lib/userData';


export default function ArtworkCardDetail(prop) {

  //checks if the objectID is in the array of favourites.  used to set state of showadded

  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);
  
  const { data, error } = useSWR(prop.objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${prop.objectID}` : null)

  useEffect(()=>{
    setShowAdded(favouritesList?.includes(prop))
  }, [favouritesList])

  //for favourites button onClick.  if show is present in favouritesList showAdded is true, and on click it is removed from the current fav list
  //and setShowAdded is set to false.  if not present, then click adds it to favs, and setShowAdded set to true.
  async function favouritesClicked(){
    if(showAdded === true){
      setFavouritesList(await removeFromFavourites(prop)) 
      setShowAdded(false)
    }if(showAdded === false){
      setFavouritesList(await addToFavourites(prop))
      setShowAdded(true)
    }
  }
  if(error){
    return <Error statusCode={404} /> 
  }

  if (data) {
    return (<>
      <Card>
        {data.primaryImage && <Card.Img variant="top" src={data.primaryImage} />}
        <Card.Body>
          <Card.Title>{data.title || "N/A"}</Card.Title>
          <Card.Text>
            <strong>Date: </strong>{data.objectDate || "N/A"}<br />
            <strong>Classification: </strong>{data.classification || "N/A"}<br />
            <strong>Medium: </strong>{data.medium || "N/A"}
            <br /><br />
            
            <strong>Artist: </strong> {data.artistDisplayName || "N/A"} {data.artistWikidata_URL && <>( <a href={data.artistWikidata_URL} target="_blank" rel="noreferrer" >wiki</a> )</>}<br />
            <strong>Credit Line: </strong> {data.creditLine || "N/A"}<br />
            <strong>Dimensions: </strong> {data.dimensions || "N/A"}
            <br />
            <br />
            <div class="favourites-button">
              { showAdded === true ? <Button variant='primary' onClick={favouritesClicked}>+ Favourite ( added )</Button> : <Button variant='outline-primary' onClick={favouritesClicked}>+ Favourite</Button>}
            </div>
          </Card.Text>

        </Card.Body>
      </Card>
    </>);

  } else {
    return null
  }

}
