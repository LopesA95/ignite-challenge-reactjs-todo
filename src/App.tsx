import { PlusCircle } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

import styles from './App.module.css'

import { Button } from './components/Button'
import { Header } from './components/Header'
import { Input } from './components/Input'
import { Empty } from './components/List/Empty'
import { Header as ListHeader } from './components/List/Header'
import { Item } from './components/List/Item'

export interface ITask {
  id: number
  text: string
  isChecked: boolean
}

export function App() {
  const [tasks, setTasks] = useState<ITask[]>([])
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const tasksSaved = localStorage.getItem('ITasks')
    if (tasksSaved) {
      setTasks(JSON.parse(tasksSaved))
    }
  }, []) // Este efeito será executado apenas uma vez, quando o componente for montado

  useEffect(() => {
    // Salvar tarefas no localStorage sempre que houver mudanças
    localStorage.setItem('ITasks', JSON.stringify(tasks))
  }, [tasks]) // Este efeito será executado sempre que 'tasks' mudar

  function handleAddTask() {
    if (!inputValue.trim()) {
      return
    }

    const newTask: ITask = {
      id: Date.now(),
      text: inputValue.trim(),
      isChecked: false,
    }

    setTasks((prevTasks) => [...prevTasks, newTask])
    setInputValue('')
  }

  function handleRemoveTask(id: number) {
    if (!window.confirm('Deseja mesmo apagar essa tarefa?')) {
      return
    }

    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
  }

  function handleToggleTask(id: number) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isChecked: !task.isChecked } : task,
      ),
    )
  }

  return (
    <main>
      <Header />
      <section className={styles.content}>
        <div className={styles.taskInfoContainer}>
          <Input
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
          />
          <Button onClick={handleAddTask}>
            Criar
            <PlusCircle size={16} color="#f2f2f2" weight="bold" />
          </Button>
        </div>
        <div className={styles.tasksList}>
          <ListHeader
            tasksCounter={tasks.length}
            checkedTasksCounter={tasks.filter((task) => task.isChecked).length}
          />
          {tasks.length > 0 ? (
            <div>
              {tasks.map((task) => (
                <Item
                  key={task.id}
                  data={task}
                  removeTask={() => handleRemoveTask(task.id)}
                  toggleTaskStatus={() => handleToggleTask(task.id)}
                />
              ))}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      </section>
    </main>
  )
}
