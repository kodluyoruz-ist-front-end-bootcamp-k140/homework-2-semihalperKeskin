import React, { useEffect, useState } from "react"
import { Button } from "../button"
import { FormItem } from "../form-item"

export function DataGrid() {

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState("ASC")

  const [todo, setTodo] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setLoading(true)
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then(x => x.json())
      .then(response => {
        setItems(response)
        setLoading(false)
      }).catch(e => {
        console.log(e)
        setLoading(false)
      })
  }

  const renderBody = () => {
    return (
      <React.Fragment>
        {/* items.sort((a, b) => b.id - a.id).map((item, i) => */}
        {items.map((item, i) => {
          return (
            <tr key={i}>
              <th scope="row" >{item.id}</th>
              <td>{item.title}</td>
              <td>{item.completed ? "Tamamlandı" : "Yapılacak"}</td>
              <td>
                <Button className="btn btn-xs btn-danger" onClick={() => onRemove(item.id)}>Sil</Button>
                <Button className="btn btn-xs btn-warning" onClick={() => onEdit(item)}>Düzenle</Button>
              </td>
            </tr>
          )
        })}
      </React.Fragment>
    )
  }

  const renderTable = () => {
    return (
      <>
        <Button onClick={onAdd}>Ekle</Button>
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => sorting(items.id)} scope="col">
                #
              </th>
              <th onClick={() => sorting(items.title)} scope="col">
                Başlık
              </th>
              <th onClick={() => sorting(items.completed)} scope="col">
                Durum
              </th>
              <th scope="col">Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>
            {renderBody()}
          </tbody>
        </table>
      </>
    )
  }

  /* Sorting Function */
  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...items].sort((a, b) => (a[col] > b[col] ? 1 : -1));
      setOrder("DESC");
      setItems(sorted);
    } else {
      const sorted = [...items].sort((a, b) => (a[col] > b[col] ? -1 : 1));
      setOrder("ASC");
      setItems(sorted);
    }
  };

  const saveChanges = () => {

    // insert 
    if (todo && todo.id === -1) {
      todo.id = Math.max(...items.map(item => item.id)) + 1;
      setItems(items => {
        items.push(todo)
        return [...items]
      })

      alert("Ekleme işlemi başarıyla gerçekleşti.")
      setTodo(null)
      return
    }
    // update
    const index = items.findIndex(item => item.id == todo.id)
    setItems(items => {
      items[index] = todo
      return [...items]
    })
    setTodo(null)
  }

  const onAdd = () => {
    setTodo({
      id: -1,
      title: "",
      completed: false
    })
  }

  const onRemove = (id) => {
    const status = window.confirm("Silmek istediğinize emin misiniz?")

    if (!status) {
      return
    }
    const index = items.findIndex(item => item.id == id)

    setItems(items => {
      items.splice(index, 1)
      return [...items]
    })
  }

  const onEdit = (todo) => {
    setTodo(todo)
  }

  const cancel = () => {
    setTodo(null)
  }

  const renderEditForm = () => {
    return (
      <>
        <FormItem
          title="Title"
          value={todo.title}
          onChange={e => setTodo(todos => {
            return { ...todos, title: e.target.value }
          })}
        />
        <FormItem
          component="checkbox"
          title="Completed"
          value={todo.completed}
          onChange={e => setTodo(todos => {
            return { ...todos, completed: e.target.checked }
          })}
        />
        <Button onClick={saveChanges}>Kaydet</Button>
        <Button className="btn btn-default" onClick={cancel}>Vazgeç</Button>
      </>
    )
  }

  return (
    <>
      {loading ? "Yükleniyor...." : (todo ? renderEditForm() : renderTable())}

    </>
  )
}