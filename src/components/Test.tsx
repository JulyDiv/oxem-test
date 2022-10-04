import axios from 'axios';
import { FC, useCallback, useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';

const Test: FC = () => {
  interface person {
    name: string
    website: string
    email: string
  }
  interface response {
    response: string | "No Response"
  }
  let initialState: person = {
    name: "LearnBestCoding",
    website: "www.learnbestcoding.com",
    email: "abc@learnbestcoding.com"
  }
    const inputStyle = {border: "1px solid black", height: 75, "padding": 10}
    const [person, setPerson] = useState<person>(initialState)
    const [response, setResponse] = useState<response>()

    const sumbitForm = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      axios.post<response>('http://localhost:8082/user/create', person)
      .then((response) => {
        setResponse(response.data)
        console.log(response.data)
      })
      .catch(function (error) {
        console.log(error);
      });
    }
    const onChangeHandler = (event: HTMLInputElement) => {
      const {name, value} = event
        setPerson((prev) => {
          return {...prev, [name]: value}
        })
    }
     return(
          <form onSubmit={sumbitForm}>
            <table style={inputStyle}>
              <tbody>
                <tr><td>Name:</td><td><input type="text" name="name" value={person.name} onChange={(e) => onChangeHandler(e.target)}/></td></tr>
                <tr><td>Age:</td><td><input type="text" name="age" value={person.website} onChange={(e) => onChangeHandler(e.target)}/></td></tr>
                <tr><td>Email:</td><td><input type="text" name="email" value={person.email} onChange={(e) => onChangeHandler(e.target)}/></td></tr>
                <tr><td ><button type="submit">Submit</button></td></tr>
                {response?.response && <tr><td colSpan={2}>{response.response}</td></tr>}
              </tbody>
            </table>
          </form>
     )
   }

export default Test;
