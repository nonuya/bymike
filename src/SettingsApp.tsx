import { get_status_message } from "./lib/string"

export default function App() {
  function handleSubmit() {
    console.log(get_status_message(false)); 
  }

  return <div>
    <a href="/">Volver</a>
    <h3>--- Configuración de tu portafolio ---</h3>
    <hr/>
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email: </label> 
      <input id="email" name="email" type="email" autoComplete="email" placeholder="john.doe@example.com"/>
      <br/> <br/>
      <label htmlFor="available">¿Aceptar clientes? </label>
      <select id="available" name="available" defaultValue="no">
        <option value="yes">Sí</option>
        <option value="no">No</option>
      </select>
      <br/> <br/>
      <button type="submit">Guardar</button>
    </form>
  </div> 
}
