import { searchHistoryAtom } from '@/store';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { ListGroupItem, ListGroup } from 'react-bootstrap';
import styles from '@/styles/History.module.css'
import { Card, Col, Container, Pagination, Row, Button } from 'react-bootstrap';
import { removeFromHistory } from '@/lib/userData';


export default function History(){

    const [ searchHistory, setSearchHistory ] = useAtom(searchHistoryAtom);
    const router = useRouter();

    let parsedHistory = [];

    searchHistory.forEach(h => {
        let params = new URLSearchParams(h);
        let entries = params.entries();
        parsedHistory.push(Object.fromEntries(entries));
    });

    function historyClicked(e, index){
        e.stopPropagation();
        if(searchHistory[index].startsWith('tags') || searchHistory[index].startsWith('artistOrCulture') || searchHistory[index].startsWith('title')){
            let results = `${searchHistory[index]}`;
            router.push(`/artwork?${results}`);
        }else{
            let results = `title=true&q=${searchHistory[index]}`
            router.push(`/artwork?${results}`);
        }
        
    }

    async function removeHistoryClicked(e, index){
        e.stopPropagation(); // stop the event from trigging other events
        setSearchHistory(await removeFromHistory(searchHistory[index]));
    }


    return(
        <>
            {parsedHistory.length === 0 ?
                (
                    <Card>
                        <Card.Body>
                            Nothing Here. Try Searching for some artwork.
                        </Card.Body>
                    </Card>
                ) 
                : 
                (
                    <ListGroup>
                        {parsedHistory.map((historyItem, index) => (
                            <ListGroupItem onClick={(e) => historyClicked(e, index)} key={index} className={styles.historyListItem}>
                                {Object.keys(historyItem).map((key) => (
                                    <>
                                     { key } <strong>{historyItem[key]}</strong>
                                    </>
                                ))}
                                <Button className="float-end" variant="danger" size="sm" onClick={(e) => removeHistoryClicked(e, index)}>
                                    &times;
                                </Button>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                )
                }
        </>
    )

}
