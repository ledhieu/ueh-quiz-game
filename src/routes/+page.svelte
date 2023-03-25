<script>
    import { onMount } from 'svelte'
    import questions from '$lib/questions.json'
    import { fly } from 'svelte/transition';
    import { init_binding_group_dynamic } from 'svelte/internal';

    let currentQuestion = 1;
    let answersLeft = 2;
    let active = false, nameFormActive = true;
    let answer;
    let timer, announcement;

    // $:question = questions[3][1]
    $: question = questions[currentQuestion - 1][Math.floor(Math.random() * 5)]
    onMount(() => {
        console.log(questions)
        const config = {
            type: Phaser.AUTO,
            width:  window.innerHeight < window.innerWidth ? window.innerWidth : 900,
            height: window.innerHeight < window.innerWidth ? window.innerHeight : 650,
            backgroundColor: 0xffe2da,
            scene: [ Manager, GameOver, MainGame, StartScene, TheLeScene, QuestionScene ],
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
            currentQuestion = 10000
            currentQuestion = num
            answer = undefined
        }
        window.setGameOver = () => {
            document.body.classList.add('gameover')
            currentQuestion = 1
            active = false
            answer = undefined
        }
        window.setNotGameOver = () => {
            document.body.classList.remove('gameover')
        }
    })

    function handleClick(choice){
        answersLeft -= 1
        answer = choice
        
        if(answer != question.answer){
            if(answersLeft == 0){
                // end game
                phaserPlugin.start('game over')
                document.body.classList.add('gameover')
                return
            }
            setTimeout(() => {
                window.setCurrentQuestion(currentQuestion)
                answer = undefined
            }, 3000)
        } else {
            timer = 3;
            let timerInterval = setInterval(() => {
                timer -= 1
                if(timer <= 0){
                    clearInterval(timerInterval)
                    timer = -1;
                }
            }, 1000)
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth'})
                active = false
                answer = undefined
                answersLeft = 2
            }, 1000)
            setTimeout(() => {
                phaserPlugin.resume()
            }, 3000)
        }
        
    }

</script>

<div id="container">
    <div id="game-container">
        {#if timer >= 0 || announcement}
            <div style="" class="announcement">
                {timer ?? announcement}
            </div>
        {/if}
    </div>
    {#key currentQuestion}
        {#if active}
        <div class:disabled={answer}
        in:fly={{ y: 100, duration: 1000, delay: 200 }}
                    out:fly={{ y: -100, duration: 1000, delay: 200 }}
        id="question-container">
            <div style="display: flex">
                <div>
                    <h1 in:fly={{ y: 100, duration: 1000, delay: 200 }}
                    out:fly={{ y: -100, duration: 1000, delay: 200 }}>
                        Câu hỏi {@html currentQuestion}
                    </h1>
                    <p in:fly={{ y: 100, duration: 1000, delay: 400 }}
                    out:fly={{ y: -100, duration: 1000, delay: 400 }}>
                        { question.question }
                    </p>
                </div>
                {#if question.image}
                    <img src={question.image} 
                    style="width: 100px; height: 100px; border-radius: 10px;
                    margin: 15px"
                    in:fly={{ y: 100, duration: 1000, delay: 600 }}
                    out:fly={{ y: -100, duration: 1000, delay: 600 }}
                    />
                {/if}
            </div>
            
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
            <p in:fly={{ y: 100, duration: 1000, delay: 1400 }}
                out:fly={{ y: -100, duration: 1000, delay: 1400 }}>
                   Bạn còn { answersLeft } lần trả lời
            </p>
        </div>
        {/if}
    {/key}

    {#if nameFormActive}
    <form class:disabled={answer}
    in:fly={{ y: 100, duration: 1000, delay: 200 }}
                out:fly={{ y: -100, duration: 1000, delay: 200 }}
    id="form-container">
        <h1 in:fly={{ y: 100, duration: 1000, delay: 200 }}
        out:fly={{ y: -100, duration: 1000, delay: 200 }}>
            Thông tin
        </h1>
        <p in:fly={{ y: 100, duration: 1000, delay: 400 }}
        out:fly={{ y: -100, duration: 1000, delay: 400 }}>
            Hãy điền mã số sinh viên của bạn vào đây để blablabla nhé
        </p>
            <input type="text" placeholder="MSSV">
            <button type="button" style="margin:auto" on:click={
                () => {nameFormActive = false}
            }>Nhập</button>
    </form>
    {/if}
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
        transition: 0.3s ease;
    }
    :global(body.gameover){
        background: #2f2b54;
        transition: 0.3s ease;
        color: white
    }
    :global(body.gameover *){
        color: white !important
    }
    *{
        font-family: Determination;
        color: #46354c;
        /* letter-spacing: 3px; */
    }
    p, h1, h2, h3, span{
        padding: 0;
        margin: 0
    }
    :global(canvas){
        width: 100vw;
        z-index: 100;
    }
    #container{
        display: flex;
        flex-direction: column;
    }
    button{
        background: #46354c;
        color: #ffe2da;
        transition: 0.3s ease;
    }
    #game-container{
        position: relative
    }
    #game-container .announcement{
        position: absolute; 
        top: 0; left: 0; right: 0; bottom: 0;
        color: #46354c; 
        font-size: 140px; 
        margin: auto; 
        width: 100%; 
        text-align: center;
    }
    #question-container, #form-container{
        padding: 20px;
        border-radius: 15px;
        background: white;
        margin: 20px;
    }
    #question-container p, #form-container p{
        font-size: 16px;
        line-height: 25px;
        margin-bottom: 20px;
    }
    #question-container h1, #form-container h1{
        margin-top: 10px;
        margin-bottom: 10px;
    }
    #question-container.disabled, #form-container.disabled{
        cursor: not-allowed
    }
    #form-container{
        display: flex;
        flex-direction: column;;
    }
    .choice-button, input, button{
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
        color: 1px solid #46354c;
        transition: 0.3s ease;
    }
    form{
        width: 100%;
    }
    input{
        padding:20px;
        margin-bottom: 0;
        cursor: text;
        padding-right: 0;
        margin-right: 0;
        width: auto;
    }
    .choice-button.wrong{
        opacity: 0.2;
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
            /* display: flex; */
            /* flex-direction: row; */
            display: block;
        }
        :global(canvas){
            height: 100vh;
            width: auto;
        }
        #question-container, #form-container{
            padding-left: 40px;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            box-shadow: 0px 0px 1000px 500px #46354c40;
            width: 30%;
            height: 90%;
            border-radius: 15px;
        
        }
        .choice-button:hover, button{
            background: #46354c;
            color: #ffe2da;
            transition: 0.3s ease;
        }
    }
</style>

