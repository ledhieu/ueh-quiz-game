<script>
    import { onMount } from 'svelte'
    import questions from '$lib/questions.json'
    import { fly } from 'svelte/transition';
    import { init_binding_group_dynamic } from 'svelte/internal';
    import Swal from 'sweetalert2'

    let currentQuestionNum, usedQuestion, question;
    let answersLeft = 2;
    let active = false, nameFormActive = false, theleActive = true;
    let answer;
    let timer, announcement;
    let MSSV = '';
    let score = 0;
    let musicShow = false;

    // $:question = questions[3][1]
    $: {
        let random;
        while(random == undefined || random == usedQuestion){
            random  = Math.floor(Math.random() * 5)
            question = currentQuestionNum ? questions[currentQuestionNum - 1][random] : {}
        }
        usedQuestion = random;
    }
    onMount(() => {
        // console.log(questions)
        const config = {
            type: Phaser.AUTO,
            width:  window.innerHeight < window.innerWidth ? window.innerWidth : 900,
            height: window.innerHeight < window.innerWidth ? window.innerHeight : 650,
            backgroundColor: 0xffe2da,
            scene: [ Manager, Win, GameOver, MainGame, StartScene, TheLeScene, QuestionScene ],
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
            currentQuestionNum = 10000
            currentQuestionNum = num
            answer = undefined
        }
        window.setGameOver = () => {
            score = 0;
            currentQuestionNum = undefined
            active = false
            answer = undefined
            console.log('setting game over')
            window.phaserPlugin.stop('main game')
            window.phaserPlugin.start('game over')
            
            console.log('set game over')
        }
        window.setNotGameOver = () => {
        }
        window.setHomeScene = () => {
            score = 0;
            active = false;
            nameFormActive = true;
            currentQuestionNum = undefined
            window.phaserPlugin.stop('main game')
            window.phaserPlugin.start('start')
        }
        window.lane = 0;
        window.win = async () => {
            score = 0;
            window.phaserPlugin.stop('main game')
            window.phaserPlugin.start('win', { mssv: MSSV })
            
            // console.log('sending from client')
            /*fetch('/send', {
                method: 'POST',
                body: JSON.stringify({mssv: MSSV})
            }).then(async result => {
                const res = await result.json()
                console.log(res)
                if(res.status != 200){
                    Swal.fire({
                    title: 'Đã xảy ra lối',
                    text: res.message,
                    icon: 'error',
                    confirmButtonText: "Đóng"
                    })
                    return
                }

                Swal.fire({
                title: 'Chúc mừng bạn',
                text: 'Mã số sinh viên của bạn đã được ghi nhận. Cảm ơn vì bạn đã tham gia nhé!',
                icon: 'success',
                timer: 2000,
                confirmButtonText: "Đóng"
                })
            })
            */
            Swal.fire({
                title: 'Chúc mừng bạn',
                text: 'Mặc dù chúng mình không nghi nhận MSSV nữa nhưng chúng mình cũng cảm ơn vì bạn đã tham gia nhé!',
                icon: 'success',
                timer: 5000,
                confirmButtonText: "Đóng"
            })
        }
        window.getScore = () => {
            return score;
        }
        // show the le immediately
        handleMSSVInput()
    })

    function handleClick(choice){
        answersLeft -= 1
        answer = choice
        
        if(answer != question.answer){
            if(answersLeft == 0){
                // end game
                window.setGameOver()
                return
            }
            setTimeout(() => {
                window.setCurrentQuestion(currentQuestionNum)
                answer = undefined
            }, 3000)
        } else {
            score += 1;
            if(score >= 7){
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth'})
                    active = false
                    answer = undefined
                    answersLeft = 2
                    window.win();
                }, 1000)
                return;
            }
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
                window.phaserPlugin.resume('main game')
            }, 3000)
        }
        
    }
    function handleMSSVInput(){
        nameFormActive = false;
        theleActive = true;
        // startMusic();
    }
    function startGame(){
        theleActive = false;
        startMusic();
        window.phaserPlugin.start('main game')
    }

    function startMusic(){
        const music = document.getElementById('music')
        music.volume = 0.15
        music.play();
        musicShow = true;
        setTimeout(() => {
            musicShow = false;
        }, 3000)
    }
</script>
<audio id="music" controls autoplay style="" class:show={musicShow}>
    <source src="/assets/music.ogg" type="audio/ogg"/>
    <source src="/assets/music.mp3" type="audio/mpeg"/>
    Your browser does not support the audio element
</audio>
<div style="position:fixed; bottom: 20px; right: 20px; z-index: 20; font-size: 13px">
    By KQM & <a href="https://ldhieu.vercel.app" target="_blank">Lê Đức Hiếu</a>
</div>
<div id="container">
    <div id="game-container">
        {#if timer >= 0 || announcement}
            <div style="" class="announcement">
                {timer ?? announcement}
            </div>
        {/if}
    </div>
    {#key currentQuestionNum}
        {#if active}
        <div class:disabled={answer}
        in:fly={{ y: 100, duration: 1000, delay: 200 }}
        out:fly={{ y: -100, duration: 1000, delay: 200 }}
        class="card"
        id="question-container">
            <div style="display: flex">
                <div>
                    <h1 in:fly={{ y: 100, duration: 1000, delay: 200 }}
                    out:fly={{ y: -100, duration: 1000, delay: 200 }}>
                        Câu hỏi {@html currentQuestionNum}
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
                {#if question[choice]}
                <button on:click={() => {handleClick(choice)}} 
                    class="choice-button"
                    class:disabled={answer}
                    class:wrong={choice != question.answer && answer == choice}
                    class:correct={choice == question.answer && answer}
                    in:fly={{ y: 100, duration: 1000, delay: 600 + 200 * i }}
                    out:fly={{ y: -100, duration: 1000, delay: 600 + 200 * i }}>
                    {choice}. {question[choice]}
                </button>
                {/if}
            {/each}
            <p in:fly={{ y: 100, duration: 1000, delay: 1400 }}
                out:fly={{ y: -100, duration: 1000, delay: 1400 }}>
                   Bạn còn { answersLeft } lần trả lời
            </p>
        </div>
        {/if}
    {/key}

    {#if nameFormActive}
    <div class:disabled={answer}
    in:fly={{ y: 100, duration: 1000, delay: 200 }}
    out:fly={{ y: -100, duration: 1000, delay: 200 }}
    class="card"
    id="form-container">
        <form>
            <h1 in:fly={{ y: 100, duration: 1000, delay: 200 }}
            out:fly={{ y: -100, duration: 1000, delay: 200 }}>
                Thông tin
            </h1>
            <p in:fly={{ y: 100, duration: 1000, delay: 400 }}
            out:fly={{ y: -100, duration: 1000, delay: 400 }}>
                Hãy điền mã số sinh viên của bạn vào đây để bắt đầu trò chơi nhé
            </p>
                <input type="text" placeholder="MSSV" bind:value={MSSV}>
                <button type="button" style="margin-top:auto" on:click={handleMSSVInput}>Nhập</button>
        </form>
    </div>
    {/if}

    {#if theleActive}
        <div class:disabled={answer}
        in:fly={{ y: 100, duration: 1000, delay: 200 }}
        out:fly={{ y: -100, duration: 1000, delay: 200 }}
        class="card"
        id="thele-container">
            <h1>THỂ LỆ</h1>
            <p>1. Bạn hãy sử dụng các mũi tên hoặc phím <kbd>W</kbd> và <kbd>A</kbd> hoặc phím <kbd>↑</kbd> và <kbd>↓</kbd> để điều khiển xe di chuyển lên xuống tránh các chướng ngại vật. 
            <br><br>2. Mỗi lần chạm vào chướng ngại vật bạn sẽ <b>mất 1 tim</b>, mất 3 tim thì trò chơi sẽ kết thúc.
            <br><br>3. Khi gặp tình huống, xe sẽ dừng lại, bạn phải trả lời đúng câu hỏi để xe có thể tiếp tục đi. Có tổng cộng 7 tình huống, tương ứng 7 câu hỏi.
            <br><br>4. Hoàn thành các câu hỏi ở <b>7 tình huống</b>, bạn sẽ chiến thắng và được ghi nhận tham gia hoạt động.

            <br><br><b>Lưu ý: Ở mỗi câu hỏi bạn chỉ có tối đa 2 lượt trả lời, nếu trả lời sai cả 2 lần bạn sẽ phải kết thúc trò chơi. Cố lên nhé!</b>
            </p>
            <button on:click={startGame}
            style="margin-top: 20px">Bắt đầu</button>
        </div>
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
    *, :global(.swal2-styled > *, .swal2-styled.swal2-confirm, #swal2-html-container, #swal2-title){
        font-family: Determination !important;
        color: #46354c;
        /* letter-spacing: 3px; */
    }
    :global(.swal2-icon.swal2-success [class^=swal2-success-line]){
        background-color:#86dcb4
    }
    :global(.swal2-icon.swal2-success .swal2-success-ring){
        border: .25em solid rgb(134 220 195 / 30%)
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
    form > button{
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
    #question-container, #form-container, #thele-container{
        padding: 20px;
        border-radius: 15px;
        /* background: white; */
    }
    .card{
        background: none;
    }
    #question-container p, #form-container p, #thele-container p{
        font-size: 16px;
        line-height: 25px;
        margin-bottom: 20px;
    }
    #question-container h1, #form-container h1, #thele-container h1{
        margin-top: 10px;
        margin-bottom: 10px;
    }
    #question-container.disabled, #form-container.disabled{
        cursor: not-allowed
    }
    #form-container form{
        display: flex;
        flex-direction: column;
        gap: 15px;
        height: 100%;
    }
    .choice-button, input, button, :global(.swal2-styled.swal2-confirm){
        border-radius: 4px;
        padding: 20px;
        width: 100%;
        margin-bottom: 20px;
        cursor: pointer;
        text-align: left;
        font-size: 16px;
        line-height: 20px;
        background: none;
        vertical-align: middle;
        border: 1px solid #46354c;
        color: #46354c;
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
    kbd {
    
    --kbd-color-background: white;
   
    --kbd-color-border:    #999999;
    --kbd-color-text:      #46354c ;
    background-color: var(--kbd-color-background);
    border-radius: 0.25rem;
    border: 1px solid var(--kbd-color-border);
    box-shadow: 0 2px 0 1px var(--kbd-color-border);
    cursor: default;
    font-family: var(--font-family-sans-serif);
    font-size: 0.75em;
    line-height: 1;
    min-width: 0.75rem;
    text-align: center;
    position: relative;
    top: -1px;
    padding: 3px 10px 3px 10px;
    vertical-align: middle;
    }
    kbd:hover {
        box-shadow: 0 1px 0 0.5px var(--kbd-color-border);
        top: 1px;
    }
    #music{
        position: fixed; bottom: 30px; left: 0; right: 0; margin: auto; z-index: 100; 

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
        .card{
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
            padding: 40px;
            background: white;
        }
        #form-container, #thele-container{
            height: min-content;
        }
        .choice-button:hover, form > button, #thele-container > button{
            background: #46354c;
            color: #ffe2da;
            transition: 0.3s ease;
        }
        #music{
            opacity: 0.05; transition: 0.2s ease
        }
        #music:hover, #music.show{
            opacity: 0.7;
            transition: 0.2s ease;
        }
    }
</style>

