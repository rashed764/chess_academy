import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BookOpen,
  Shield,
  Lightbulb,
} from 'lucide-react';
import type { BoardArrow, StudentProfile } from '../../types';
import { Chessboard } from '../chess/Chessboard';
import { CoachEngine } from '../../lib/ai/coachEngine';
import { makeMoveSafe, START_FEN } from '../../lib/chess/rules';
import { chessAudio } from '../../lib/sound/chessAudio';

interface CoachViewProps {
  profile: StudentProfile;
}

interface Message {
  id: string;
  sender: 'coach' | 'student';
  text: string;
  suggestedReplies?: string[];
  timestamp: string;
}

export const CoachView: React.FC<CoachViewProps> = ({ profile }) => {
  const [boardFen, setBoardFen] = useState<string>('r1bqk2r/pppp1ppp/2n5/4p3/2B1n3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 5');
  const [highlightSquares, setHighlightSquares] = useState<string[]>(['c4', 'f7']);
  const [arrows, setArrows] = useState<BoardArrow[]>([
    { from: 'c4', to: 'f7', color: '#ef4444' },
  ]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  const [hintLevel, setHintLevel] = useState<number>(1);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'coach',
      text: `Greetings, ${profile.displayName}. I am Grandmaster Mikhail, your personal AI chess coach. We have an intriguing position on the board. Notice the White bishop on c4 exerting fierce pressure against Black's f7 pawn. What would you like to explore or practice?`,
      suggestedReplies: [
        'Give me a hint',
        'Why is f7 weak?',
        'How does a fork work?',
        'Evaluate this position',
      ],
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isThinking) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'student',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsThinking(true);

    try {
      const response = await CoachEngine.getCoachFeedback(userText, {
        fen: boardFen,
        hintLevel,
        studentRating: profile.estimatedElo,
      });

      // Apply board actions from AI
      if (response.actions) {
        for (const act of response.actions) {
          if (act.type === 'HIGHLIGHT_SQUARES' && act.squares) {
            setHighlightSquares(act.squares);
          } else if (act.type === 'DRAW_ARROW' && act.arrow) {
            setArrows([act.arrow]);
          } else if (act.type === 'PLAY_MOVE' && act.move) {
            const moveRes = makeMoveSafe(boardFen, act.move.from, act.move.to, act.move.promotion);
            if (moveRes.success) {
              setBoardFen(moveRes.newFen);
              setLastMove({ from: act.move.from, to: act.move.to });
              chessAudio.playMove();
            }
          }
        }
      }

      const coachMsg: Message = {
        id: `c-${Date.now()}`,
        sender: 'coach',
        text: response.message,
        suggestedReplies: response.suggested_replies,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, coachMsg]);
    } catch {
      const fallback: Message = {
        id: `c-err-${Date.now()}`,
        sender: 'coach',
        text: 'Let us focus on fundamental piece harmony: control the central squares, keep your king safe behind a shield of pawns, and never leave pieces undefended.',
        timestamp: 'Just now',
      };
      setMessages(prev => [...prev, fallback]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleBoardMove = (from: string, to: string, promotion: string = 'q') => {
    const res = makeMoveSafe(boardFen, from, to, promotion);
    if (res.success) {
      setBoardFen(res.newFen);
      setLastMove({ from, to });
      // Clear arrows on new move
      setArrows([]);
      setHighlightSquares([from, to]);

      // Provide automatic quick coaching on move
      handleSendMessage(`I played ${res.move?.san}`);
    }
  };

  const requestGraduatedHint = () => {
    const hintResp = CoachEngine.generateGraduatedHint(boardFen, hintLevel);
    setHintLevel(prev => (prev >= 3 ? 1 : prev + 1));

    if (hintResp.actions) {
      for (const act of hintResp.actions) {
        if (act.type === 'HIGHLIGHT_SQUARES' && act.squares) {
          setHighlightSquares(act.squares);
        } else if (act.type === 'DRAW_ARROW' && act.arrow) {
          setArrows([act.arrow]);
        }
      }
    }

    const msg: Message = {
      id: `h-${Date.now()}`,
      sender: 'coach',
      text: hintResp.message,
      suggestedReplies: hintResp.suggested_replies,
      timestamp: 'Just now',
    };
    setMessages(prev => [...prev, msg]);
  };

  const resetBoard = () => {
    setBoardFen(START_FEN);
    setLastMove(null);
    setHighlightSquares([]);
    setArrows([]);
    setHintLevel(1);
    chessAudio.playMove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: AI Coach Conversation */}
        <div className="lg:col-span-5 bg-[#121d2e] rounded-3xl border border-[#19273a] shadow-xl flex flex-col h-[650px] overflow-hidden">
          {/* Coach Header */}
          <div className="p-4 bg-[#152336] border-b border-[#19273a] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#d6b56d]/15 border border-[#d6b56d] flex items-center justify-center text-[#d6b56d]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="font-display font-bold text-sm text-[#f3f0e8] flex items-center gap-2">
                  <span>Grandmaster Mikhail</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[11px] text-[#d6b56d]">AI Academy Personal Coach</div>
              </div>
            </div>

            <button
              onClick={requestGraduatedHint}
              className="px-3 py-1.5 rounded-lg bg-[#0b1220] border border-[#d6b56d]/30 text-xs font-semibold text-[#d6b56d] hover:bg-[#19273a] flex items-center gap-1.5 cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Hint (Lvl {hintLevel})</span>
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'student'
                      ? 'bg-[#d6b56d] text-[#0b1220] font-medium rounded-tr-none'
                      : 'bg-[#19273a] text-[#f3f0e8] border border-[#26374f] rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-[#728096] mt-1 px-1">{msg.timestamp}</span>

                {/* Suggested Quick Replies */}
                {msg.sender === 'coach' && msg.suggestedReplies && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.suggestedReplies.map((reply, rIdx) => (
                      <button
                        key={rIdx}
                        onClick={() => handleSendMessage(reply)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-[#0b1220] hover:bg-[#19273a] border border-[#2b3e59] text-[#d6b56d] cursor-pointer transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-[#aab5c4] p-2 bg-[#19273a]/40 rounded-xl max-w-fit">
                <Bot className="w-4 h-4 text-[#d6b56d] animate-spin" />
                <span>Mikhail is evaluating the board...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[#152336] border-t border-[#19273a]">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage(inputPrompt);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={e => setInputPrompt(e.target.value)}
                placeholder="Ask about candidate moves, tactics, or request a hint..."
                className="flex-1 bg-[#0b1220] border border-[#26374f] focus:border-[#d6b56d] rounded-xl px-3.5 py-2.5 text-xs text-[#f3f0e8] placeholder-[#728096] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isThinking}
                className="p-2.5 rounded-xl bg-[#d6b56d] hover:bg-[#e5c782] disabled:opacity-40 text-[#0b1220] cursor-pointer transition-colors"
                aria-label="Send query to coach"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Interactive Analysis Board */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-[540px]">
            <Chessboard
              fen={boardFen}
              highlightSquares={highlightSquares}
              arrows={arrows}
              lastMove={lastMove}
              interactive={true}
              onMove={handleBoardMove}
            />

            {/* Board Controls */}
            <div className="mt-4 p-4 rounded-2xl bg-[#121d2e] border border-[#19273a] flex flex-wrap items-center justify-between gap-3 text-xs text-[#aab5c4]">
              <div className="flex items-center gap-2">
                <button
                  onClick={resetBoard}
                  className="px-3 py-1.5 rounded-lg bg-[#0b1220] hover:bg-[#19273a] text-[#f3f0e8] flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start Position</span>
                </button>
                <button
                  onClick={() => {
                    setArrows([]);
                    setHighlightSquares([]);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#0b1220] hover:bg-[#19273a] text-[#aab5c4] hover:text-[#f3f0e8] cursor-pointer"
                >
                  Clear Highlights
                </button>
              </div>

              <span className="text-[11px] text-[#d6b56d]">
                Tip: Drag or click pieces to analyze any line
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
