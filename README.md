# Web MIDI Thru Tool

Webブラウザで動くMIDI THRUアプリケーションです。

MIDI THRUではありますが、信号の加工を搭載している関係で、Note On/OffとCCを渡すくらいしか出来ません。

トランスポーズを搭載していないキーボードやMIDI楽器でトランスポーズを実現するために作りました。

- チャンネル変換(任意のChから任意のChへ)
- Program Changeの送信(音色変更)
- Volume変更
- Velocity固定化
- CCダイヤル等の意味の変更
- トランスポーズ(-12~+12)
- SysExの送信、音源リセット

が出来ます。

フォーク元のプログラムからは基本的なMIDIの送受信部分を利用させていただいています。

加工部等の追加実装、及び各部バグ等の修正をしました。


This is a MIDI THRU application that runs in a web browser.

Although it is a MIDI THRU, it can only pass Note On/Off and CC due to the signal processing.

I made this application to realize transposition on keyboards and MIDI instruments that do not have transposition.

The following functions are available

- Channel Convert
- Sending Program Change (Tone Change)
- Change Volume
- Fixing Velocity
- Change the meaning of CC Dial
- Transpose (-12~+12)
- Send SysEx, reset sound source

The basic MIDI sending and receiving parts are used from the original program.

![](https://cdn.discordapp.com/attachments/925382779653480480/927917933685010504/unknown.png)

## 使い方/How to use

keyboard.htmlにWebサーバー経由でアクセスするか、keyboard.html自体をブラウザで直接開いてください。

または

https://mikuta0407.net/tools/web-midi-thru-tools/

にアクセスしても利用できます。

使い方はUIを見れば何となく分かるかと思います。

このプログラムは開いたときにJavaScriptのファイルを取りに行く以外でサーバーと通信することはありません。(基本的にライブラリのダウンロード以外スタンドアロンで動作します。つまりkeyboard.htmlのheadに書いてあるjsファイルをローカルに落としてパスを変えればオフラインでも動きます。)

Access keyboard.html using a web server or open keyboard.html in your browser.

Or you can use it here.
https://mikuta0407.net/tools/web-midi-thru-tools/

The program does not communicate with the server except for the initial loading.

## 注意事項/Precautions

TinySynthの発音がデフォルトで有効になっています。

外部音源に音を出す場合はミュートをお忘れなく。

The built-in synthesizer is enabled by default.

Please mute it if you don't need it.

## 既知の不具合/Known bugs

開いたときにはMidiInとMidiOutを適切に認識していません。一度選択し直してから利用してください。

When you open it, MidiIn and MidiOut are not properly recognized. Please select them again and then use them.

## license

see "license.txt"

and, this project quoted by web audio-controls  
https://github.com/g200kg/webaudio-controls



