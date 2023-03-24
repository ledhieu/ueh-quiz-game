<script>
    import { onMount } from 'svelte'
    import questions from '$lib/questions.json'
    import { fly } from 'svelte/transition';

    let currentQuestion = 1;
    let answersLeft = 2;
    let active = false;
    let answer;
    $: question = questions[currentQuestion - 1][Math.floor(Math.random() * 5)]
    onMount(() => {
        console.log(questions)
        const config = {
            type: Phaser.AUTO,
            width: 900,
            height: 640,
            backgroundColor: 0xf12312,
            scene: [ MainGame, StartScene, TheLeScene, QuestionScene ],
            pixelArt: true,
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false
                }
            },
            parent: document.getElementById('game-container')
        }
        const game = new Phaser.Game(config)
        console.log(game)
        window.setCurrentQuestion = num => {
            active = true
            currentQuestion = 0
            currentQuestion = num
            answersLeft = 2
            answer = undefined
            console.log('paused game')
        }
    })

    function handleClick(choice){
        answersLeft -= 1
        answer = choice
        
        if(answer != question.answer){
            setTimeout(() => {
                if(answersLeft == 0){
                    // end game
                    return
                }
                window.setCurrentQuestion(currentQuestion)
                answer = undefined
            }, 3000)
        } else {
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth'})
            }, 1000)
            setTimeout(() => {
                active = false
                answer = undefined
                phaserPlugin.resume()
            }, 2000)
        }
        
    }

</script>

<div id="container">
    <div id="game-container"></div>
    {#key currentQuestion}
        {#if active}
        <div class:disabled={answer}
        id="question-container">
            <h1 in:fly={{ y: 100, duration: 1000, delay: 200 }}
            out:fly={{ y: -100, duration: 1000, delay: 200 }}>
                Câu hỏi {@html currentQuestion}
            </h1>
            <p in:fly={{ y: 100, duration: 1000, delay: 400 }}
            out:fly={{ y: -100, duration: 1000, delay: 400 }}>
                { question.question }
            </p>
            
            {#each ['A', 'B', 'C', 'D'] as choice, i}
            <button on:click={() => {handleClick(choice)}} 
                class="choice-button"
                class:disabled={answer}
                class:wrong={choice != question.answer && answer == choice}
                class:correct={choice == question.answer && answer}
                in:fly={{ y: 100, duration: 1000, delay: 600 + 200 * i }}
                out:fly={{ y: -100, duration: 1000, delay: 600 + 200 * i }}>
                {choice}. {question[choice]}
            </button>
            {/each}
        
        </div>
        {/if}
    {/key}
</div>

<style>
    @font-face {
        font-family: 'Fernando';
        font-style: normal;
        font-weight: 500;
        src: url('/FVF Fernando 08.ttf'); /* IE9 Compat Modes */
    }
    @font-face {
        font-family: 'Determination';
        font-style: normal;
        font-weight: 500;
        src: url('/SVN-Determination Sans.otf'); /* IE9 Compat Modes */
    }
    :global(body){
        background: #ffe2da;
        width: 100vw;
        margin: 0;
        padding: 0;
    }
    *{
        font-family: Determination;
        color: #46354c;
        /* letter-spacing: 3px; */
    }
    :global(canvas){
        width: 100vw;
        z-index: 100;
    }
    #container{
        display: flex;
        flex-direction: column;
    }
    #question-container{
        padding: 20px;
    }
    #question-container p{
        font-size: 16px;
        line-height: 25px;
        margin-bottom: 50px;
    }
    #question-container.disabled{
        cursor: not-allowed
    }
    button{
        border-radius: 4px;
        padding: 30px;
        width: 100%;
        margin-bottom: 20px;
        cursor: pointer;
        text-align: left;
        font-size: 16px;
        line-height: 20px;
        background: none;
        vertical-align: middle;
        border: 1px solid #46354c;
        transition: 0.3s ease;
    }
    .choice-button:hover{
        background: #46354c;
        color: #ffe2da;
        transition: 0.3s ease;
    }
    .choice-button.wrong{
        background: #ff4b62;
    }
    .choice-button.correct{
        background: #40a591;
    }
    .choice-button.disabled{
        pointer-events: none;
        cursor: not-allowed;
    }
    
    @media only screen and (min-width: 1000px){
        #container{
            display: flex;
            flex-direction: row;
        }
        :global(canvas){
            height: 100vh;
            width: auto;
        }
        #question-container{
            padding-left: 40px;
        }
    }
</style>

