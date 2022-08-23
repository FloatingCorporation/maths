<script lang="ts">
  import logo from './assets/rocket.png'
  import Peer from 'peerjs'
  import QRCode from 'qrcode'
  import {generateNewQuestion, answerHandler } from './lib/questions'
  import type {QuestionParameters} from './lib/questions'

  let question: QuestionParameters = generateNewQuestion()
  let score: number = 0

  let username: string = ''
  let singlePlayer: boolean = true
  let isServer: boolean = false
  let qrCode: any = ''
  let peers: any = {}
  let peersTable: any = []
  let connection: Function = (): void => {}
  let schoolNetwork: boolean = false

  let lastCorrectTimestamp: number = 0
  let correctClass: boolean = false

  const onChange = (): void => {
    if (answerHandler(question)) {
      question = generateNewQuestion()
      score++
      connection()
      lastCorrectTimestamp = Date.now()
    }
    correctClass =
      lastCorrectTimestamp == 0
        ? false
        : Date.now() - Number(lastCorrectTimestamp) < 1000
  }

  // Multiplayer Handling
  const startServer = (): void => {
    singlePlayer = false
    isServer = true
    let peer = new Peer()
    peer.on('open', (id: string) => {
      let qrCodeSource: string = ''
      if (Math.random() > 0.9) {
        qrCodeSource = 'https://www.youtube.com/watch?v=CAZ8kTQ49c8'
      } else {
        qrCodeSource = `${window.location.origin}/join/${id}`
      }
      // create qrcode
      QRCode.toDataURL(
        qrCodeSource,
        { scale: 20 },
        (err: any, url: string) => {
          qrCode = url
          console.log(`${window.location.origin}/join/${id}`)
        }
      )
    })

    peer.on('connection', (conn: any) => {
      conn.on('data', (data: { name: string; score: number }) => {
        peers[data.name] = data.score
        peersTable = Object.keys(peers).sort((a: string, b: string) => {
          return peers[b] - peers[a]
        }).map((key: string) => {
          return {
            name: key,
            score: peers[key]
          }
        })
      })
    })

    fetch('https://maths.pythonisterrible.cf/api/asn')
      .then((response) => response.text())
      .then((text) => {
        console.log('ASN:', text)
        if (text == '24313') {
          schoolNetwork = true
          console.warn('School network detected. External WebRTC may be blocked.');
        }
      });
  }

  const joinGame = (id: string): any => {
    singlePlayer = false
    username = prompt('Enter your name')
    let peer = new Peer()
    peer.on('open', () => {
      let conn = peer.connect(id)
      conn.on('open', () => {
        connection = (): void => conn.send({ name: username, score: score })
      })
    })
  }

  if (window.location.pathname.includes('/join/')) {
    connection = joinGame(window.location.pathname.replace('/join/', ''))
  }
</script>

<main>
  <img
    src={logo}
    class="rocketlogo"
    class:correct={correctClass}
    alt="Rocket Logo"
    id="logo"
  />
  <h1>Learn Maths Better</h1>

  {#if !isServer}
    <div class="card">
      <h2 id="question">{question.question}</h2>
      <input
        type="number"
        class="number-input"
        on:keyup={onChange}
        bind:value={question.answer}
      />
    </div>
  {/if}
  {#if isServer}
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {#each peersTable as peer}
          <tr>
            <td>{peer.name}</td>
            <td>{peer.score}</td>
          </tr>
        {/each}
      </tbody>
    </table>
    {#if schoolNetwork}
    <p><i>
      <b>You've been detected as on school internet.</b>
      External WebRTC may be blocked, and you'll need to connect
      via LAN.
    </i></p>
    {/if}
  {/if}
  {#if qrCode}
    <div class="qr-code">
      <img src={qrCode} alt="QR Code" height="400px" />
    </div>
  {/if}
  {#if singlePlayer}
    <button on:click={startServer}>Start Server (prefers Chrome)</button>
  {/if}
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
