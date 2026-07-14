/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const words = [
  'carrot',
  'potato',
  'tomato',
  'onion',
  'pepper',
  'spinach',
  'cabbage',
  'broccoli',
  'lettuce',
  'celery'
]

function App () {
  const maxStrikes = 3

 const savedWords = localStorage.getItem('gameWords')
const startingWords = savedWords ? JSON.parse(savedWords) : words

const [gameWords, setGameWords] = React.useState(startingWords)

const [scrambledWord, setScrambledWord] = React.useState(
  shuffle(startingWords[0] || words[0])
)

  const [guess, setGuess] = React.useState('')
  const [message, setMessage] = React.useState('')

  const [points, setPoints] = React.useState(() =>
    parseInt(localStorage.getItem('points')) || 0
  )

  const [strikes, setStrikes] = React.useState(() =>
    parseInt(localStorage.getItem('strikes')) || 0
  )

const [passes, setPasses] = React.useState(() => {
  const savedPasses = localStorage.getItem('passes')

  if (savedPasses === null) {
    return 3
  }

  return parseInt(savedPasses)
})

  const word = gameWords[0]
  const gameOver = strikes >= maxStrikes || gameWords.length === 0

  React.useEffect(() => {
    localStorage.setItem('points', points)
  }, [points])

  React.useEffect(() => {
    localStorage.setItem('strikes', strikes)
  }, [strikes])

  React.useEffect(() => {
    localStorage.setItem('passes', passes)
  }, [passes])

  React.useEffect(() => {
    localStorage.setItem('gameWords', JSON.stringify(gameWords))
  }, [gameWords])

  function handleSubmit (event) {
    event.preventDefault()

    if (guess.toLowerCase() === word.toLowerCase()) {
      const remainingWords = gameWords.slice(1)

      setMessage('Correct!')
      setPoints(points + 1)
      setGameWords(remainingWords)

      if (remainingWords.length > 0) {
        setScrambledWord(shuffle(remainingWords[0]))
      }
    } else {
      setMessage('Incorrect. Try again.')
      setStrikes(strikes + 1)
    }

    setGuess('')
  }

  function handlePass () {
    if (passes > 0) {
      const remainingWords = gameWords.slice(1)

      setPasses(passes - 1)
      setGameWords(remainingWords)
      setMessage('Word passed.')

      if (remainingWords.length > 0) {
        setScrambledWord(shuffle(remainingWords[0]))
      }
    }
  }

  function handleReset () {
    setGameWords(words)
    setScrambledWord(shuffle(words[0]))
    setGuess('')
    setMessage('')
    setPoints(0)
    setStrikes(0)
    setPasses(3)
  }

  return (
    <main>
      <h1>Welcome to Scramble</h1>

     <div className="stats">
  <p>Points: {points}</p>
  <p>Strikes: {strikes} / {maxStrikes}</p>
  <p>Passes: {passes}</p>
</div>

      {gameOver ? (
        <div>
          <h2>Game Over</h2>

          {gameWords.length === 0 ? (
            <p>You completed all the words!</p>
          ) : (
            <p>You reached the maximum number of strikes.</p>
          )}

          <button type="button" onClick={handleReset}>
            Play Again
          </button>
        </div>
      ) : (
        <div>
          <p>Unscramble this word:</p>
          <h2>{scrambledWord}</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={guess}
              onChange={(event) => setGuess(event.target.value)}
            />

            <button type="submit">Guess</button>
          </form>

          <button
            type="button"
            onClick={handlePass}
            disabled={passes === 0}
          >
            Pass
          </button>

          <p>{message}</p>
        </div>
      )}
    </main>
  )
}
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)