<script lang="ts">
  import logo from './assets/rocket.png'

  let question: string = ''
  let x: number
  let y: number
  let answer: string

  let debug: boolean = false

  let lastCorrectTimestamp: number = 0
  let show: boolean = false

  const handleNewQuestion = (): void => {
    x = Math.floor(Math.random() * 10) + 1
    y = Math.floor(Math.random() * 10) + 1
    answer = ''

    question = `${x} + ${y} = ?`
  }

  const onChange = (): void => {
    if (Number(answer) === x + y) {
      handleNewQuestion()
      lastCorrectTimestamp = Date.now()
    }
    show =
      lastCorrectTimestamp == 0
        ? false
        : Date.now() - Number(lastCorrectTimestamp) < 2000
  }

  handleNewQuestion()
</script>

<main>
  <img
    src={logo}
    class="rocketlogo"
    class:correct={show}
    alt="Rocket Logo"
    id="logo"
  />
  <h1>Learn Maths Better</h1>

  <div class="card">
    <h2 id="question">{question}</h2>
    <input
      type="number"
      class="number-input"
      on:keyup={onChange}
      bind:value={answer}
    />
    {#if debug}
      <pre>{JSON.stringify({ x, y, answer }, null, 2)}</pre>
      <pre>{JSON.stringify({ lastCorrectTimestamp }, null, 2)}</pre>
      <pre>{lastCorrectTimestamp == 0
          ? false
          : Date.now() - Number(lastCorrectTimestamp) < 2000}</pre>
      <pre> {show} </pre>
    {/if}
  </div>
</main>

<style>
  .rocketlogo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 0.3s ease-in-out;
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .rocketlogo:hover {
    filter: drop-shadow(0 0 2em #374adcf7);
  }
  .correct {
    filter: drop-shadow(0 0 2em #66ff66aa);
  }
  .number-input {
    border: none;
    outline: none;
    font-size: 2em;
    padding: 0.5em;
    width: 100%;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
