import time
import sys

def type_lyric(line, char_delay=0.06):
    for char in line:
        print(char, end="", flush=True)
        time.sleep(char_delay)
    print()

def play_reel():
    lyrics = [
        "Secrets I have held in my heart ✨",
        "Are harder to hide than I thought 🌟",
        "Maybe I just wanna be yours 💫",
        "I wanna be yours, I wanna be yours 🎵",
        "Wanna be yours 🔥",
        "Wanna be yours 💖",
        "Wanna be yours 🌙"
    ]

    delays = [1.8, 1.8, 2.2, 2.5, 1.2, 2.0, 2.0]
    print("\n🎧 Now Playing: \"I Wanna Be Yours\" — Arctic Monkeys  🎧\n")
    time.sleep(1.5)
    for i, line in enumerate(lyrics):
        type_lyric(line)
        time.sleep(delays[i])

play_reel()