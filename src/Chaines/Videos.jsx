import React, { useEffect, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { useParams } from 'react-router-dom'
import CustomiseHook from './CustomiseHook'
import ReactPlayer from 'react-player'
import OpenAI from 'openai';
import { db } from '../firebase-config';
import { addDoc, collection, getDocs } from 'firebase/firestore';

const Videos = () => {
    const [notes, setnotes] = useState([])
    const [question, Setquestion] = useState('');
    const [response, Setresponse] = useState('');
    const [playlists, SetPlaylists] = useState([])
    const [note, Setnote] = useState("")
    const [currentvideo, Setcurrentvideo] = useState('9boMnm5X9ak')

    const { id } = useParams()
    const UsersCollectionRef = collection(db, "notes")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDocs(UsersCollectionRef)
                setnotes(data.docs.map((elem) => ({ ...elem.data(), id: elem.id })))
            } catch (error) {
                console.error('Error fetching data from Firestore:', error);
            }
        };

        fetchData();
    }, [UsersCollectionRef]);

    // console.log(notes);


    var options = {
        params: {
            part: 'snippet',
            playlistId: 'PLrSOXFDHBtfFuZttC17M-jNpKnzUL5Adc',
            maxResults: '50',
        },

        headers: {
            'X-RapidAPI-Key': '',
            'X-RapidAPI-Host': 'youtube-v311.p.rapidapi.com'
        }
    };

    const url = "https://youtube-v311.p.rapidapi.com/playlistItems/";

    useEffect(() => {
        options.params.playlistId = id
        CustomiseHook(url, options).then(res => res.data).then(res => SetPlaylists(res))
    }, [id])

    let ved1 = playlists.items ? playlists.items[0].snippet.resourceId.videoId : null
    // console.log(ved1);






    // useEffect(() => {
    const openai = new OpenAI({
        apiKey: '',
        dangerouslyAllowBrowser: true,
    });

    async function main() {

        Setquestion(notes.filter(elem => elem.videoID == ved1).map(note => note.title).join(' - '))
        // console.log(question);

        try {

            const completion = question && await openai.chat.completions.create({
                messages: [{ role: 'system', content: `generer un resumer à partir de ces notes et commencer par en resumé de ses notes : ${question}` }],
                model: 'gpt-3.5-turbo',
            });

            question && Setresponse(completion.choices[0].message.content);
        } catch (error) {
            console.error('Error fetching OpenAI completion:', error);
        }
    }

    // main();
    // }, []); 
    // useEffect(()=>{





    // const handleAddNote = () => {
    //     try {
    //       const data = {
    //         title: note,
    //         videoID: currentvideo
    //       };

    //       const UsersCollectionRef = collection(db, "notes");

    //       // Ajouter un nouveau document à la collection "notes"
    //       const docRef =  addDoc(UsersCollectionRef, data);

    //       console.log("Document written with ID:", docRef.id);
    //     } catch (error) {
    //       console.error("Error adding document:", error);
    //     }

    //   };



    const handleAddNote = async () => {
        // alert()
        // e.preventDefault()
        try {
            await addDoc(collection(db, 'notes'), {
                title: note,
                videoID: currentvideo
            })
            Setnote("")
        } catch (err) {
            alert(err)
        }
    }



    // },[])





    return (
        <div className='d-flex gap-3  p-2 jutify-content-center bg-info mt-5'>
            <div className="col-md-9 currentvideo">
                <ReactPlayer

                    controls
                    className="react-player w-100"
                    url={`https://www.youtube.com/watch?v=${ved1}`}
                />
                <div className='text-bold text-light text-header bg-dark rounded-1 my-2 p-3'>
                    <h3>test title</h3>
                    et nesciunt! Assumenda sed reprehenderit ducimus similique explicabo eligendi dolores cumque magnam laudantium praesentium. Quod odio voluptatibus perspiciatis impedit harum pariatur, nemo facilis, aperiam asperiores quidem ex beatae porro?
                    Error porro libero autem blanditiis, facere doloremque vitae culpa laborum maiores aut magni. Voluptatem quae earum fugit inventore assumenda. Quasi error optio similique animi fugiat architecto voluptates, recusandae praesentium eligendi.

                </div>

                <div>

                    <input type="text" onChange={(e) => { Setnote(e.target.value) }} />
                    <button onClick={handleAddNote}>Add note</button>
                </div>



                {/* <input type="text" onChange={(e) => Setquestion(e.target.value)} /> */}
                <button onClick={main} className='btn btn-success w-25'>Voir le résumé</button>
                {
                    notes && (
                        <div className='border p-3 fw-bold bg-light rounded-2 m-2 text-dark fs-5'>
                            <details>
                                <summary>Votre Notes </summary>
                                <ul>

                                    {notes.filter(elem => elem.videoID == ved1).map((val, key) => (
                                        <li key={key}>{val.title}</li>
                                    ))}
                                </ul>
                            </details>

                        </div>
                    )
                }
                {
                    response && (
                        <div className='border p-3 fw-bold bg-light rounded-2 m-2 text-dark fs-5'>

                            <details>
                                <summary>Voir le résumé </summary>
                                {response}
                            </details>
                        </div>
                    )
                }

            </div>

            <div className="col-md-3">
                {playlists.items &&
                    playlists.items.map((play, ind) => (
                        <div className="row m-0" key={ind}>
                            <img
                                className="col-md-7  rounded-2"
                                src={play?.snippet.thumbnails.high.url}
                                alt=""
                            />
                            <p className="col-md-5 text-light">
                                {play?.snippet.title}
                                <i className="fa-solid fa-circle-check text-white-50 check ms-2"></i>
                            </p>



                        </div>
                    ))
                }
            </div>

        </div>
    )
}

export default Videos
