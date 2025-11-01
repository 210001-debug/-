"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Save,
  Edit3,
  Plus,
  Trash2,
  CalendarIcon,
  User,
  FileText,
  TrendingUp,
  Target,
  Heart,
  Activity,
} from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

interface Player {
  id: number
  name: string
  position: string
  number: number
  goals: number
  assists: number
  matches: number
}

interface PlayerNote {
  id: string
  date: Date
  title: string
  content: string
  category: "performance" | "training" | "medical" | "personal" | "tactical"
}

interface PlayerStats {
  height: string
  weight: string
  age: string
  dominantFoot: "右足" | "左足" | "両足"
  joinDate: string
  previousClub: string
  emergencyContact: string
  medicalNotes: string
}

interface PlayerDocumentProps {
  player: Player
  onClose: () => void
}

const categoryColors = {
  performance: "bg-green-100 text-green-800",
  training: "bg-blue-100 text-blue-800",
  medical: "bg-red-100 text-red-800",
  personal: "bg-purple-100 text-purple-800",
  tactical: "bg-orange-100 text-orange-800",
}

const categoryLabels = {
  performance: "パフォーマンス",
  training: "練習",
  medical: "医療",
  personal: "個人",
  tactical: "戦術",
}

export function PlayerDocument({ player, onClose }: PlayerDocumentProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [showAddNote, setShowAddNote] = useState(false)

  // 選手の基本情報
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    height: "175cm",
    weight: "70kg",
    age: "23歳",
    dominantFoot: "右足",
    joinDate: "2023-04-01",
    previousClub: "青春FC",
    emergencyContact: "090-1234-5678",
    medicalNotes: "特になし",
  })

  // ノート管理
  const [notes, setNotes] = useState<PlayerNote[]>([
    {
      id: "1",
      date: new Date("2024-01-15"),
      title: "優秀なパフォーマンス",
      content: "今日の試合で2ゴール1アシストの活躍。ポジショニングが特に良かった。",
      category: "performance",
    },
    {
      id: "2",
      date: new Date("2024-01-10"),
      title: "練習での改善点",
      content: "シュート精度の向上が必要。来週から特別練習を実施予定。",
      category: "training",
    },
  ])

  // 新しいノート追加
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "performance" as PlayerNote["category"],
    date: new Date(),
  })

  const handleSaveStats = () => {
    setIsEditing(false)
    // ここで実際のデータ保存処理を行う
  }

  const handleAddNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note: PlayerNote = {
        id: Date.now().toString(),
        ...newNote,
      }
      setNotes([note, ...notes])
      setNewNote({
        title: "",
        content: "",
        category: "performance",
        date: new Date(),
      })
      setShowAddNote(false)
    }
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-2xl font-bold bg-blue-500 text-white">{player.number}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{player.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline">{player.position}</Badge>
                <Badge variant="secondary">#{player.number}</Badge>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            閉じる
          </Button>
        </div>

        {/* タブナビゲーション */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="border-b px-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>概要</span>
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>記録</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>統計</span>
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>目標</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* 概要タブ */}
            <TabsContent value="overview" className="p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* 基本情報 */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>基本情報</span>
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      {isEditing ? "キャンセル" : "編集"}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="height">身長</Label>
                            <Input
                              id="height"
                              value={playerStats.height}
                              onChange={(e) => setPlayerStats({ ...playerStats, height: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="weight">体重</Label>
                            <Input
                              id="weight"
                              value={playerStats.weight}
                              onChange={(e) => setPlayerStats({ ...playerStats, weight: e.target.value })}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="age">年齢</Label>
                          <Input
                            id="age"
                            value={playerStats.age}
                            onChange={(e) => setPlayerStats({ ...playerStats, age: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="foot">利き足</Label>
                          <select
                            id="foot"
                            className="w-full p-2 border rounded-md"
                            value={playerStats.dominantFoot}
                            onChange={(e) =>
                              setPlayerStats({
                                ...playerStats,
                                dominantFoot: e.target.value as PlayerStats["dominantFoot"],
                              })
                            }
                          >
                            <option value="右足">右足</option>
                            <option value="左足">左足</option>
                            <option value="両足">両足</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="joinDate">入団日</Label>
                          <Input
                            id="joinDate"
                            type="date"
                            value={playerStats.joinDate}
                            onChange={(e) => setPlayerStats({ ...playerStats, joinDate: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="previousClub">前所属クラブ</Label>
                          <Input
                            id="previousClub"
                            value={playerStats.previousClub}
                            onChange={(e) => setPlayerStats({ ...playerStats, previousClub: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="emergency">緊急連絡先</Label>
                          <Input
                            id="emergency"
                            value={playerStats.emergencyContact}
                            onChange={(e) => setPlayerStats({ ...playerStats, emergencyContact: e.target.value })}
                          />
                        </div>
                        <Button onClick={handleSaveStats} className="w-full">
                          <Save className="h-4 w-4 mr-2" />
                          保存
                        </Button>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">身長:</span>
                          <span className="font-medium">{playerStats.height}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">体重:</span>
                          <span className="font-medium">{playerStats.weight}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">年齢:</span>
                          <span className="font-medium">{playerStats.age}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">利き足:</span>
                          <span className="font-medium">{playerStats.dominantFoot}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">入団日:</span>
                          <span className="font-medium">{playerStats.joinDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">前所属:</span>
                          <span className="font-medium">{playerStats.previousClub}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">緊急連絡先:</span>
                          <span className="font-medium">{playerStats.emergencyContact}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 今シーズンの成績 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>今シーズンの成績</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-3xl font-bold text-green-600">{player.goals}</p>
                        <p className="text-sm text-muted-foreground">得点</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-blue-600">{player.assists}</p>
                        <p className="text-sm text-muted-foreground">アシスト</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-purple-600">{player.matches}</p>
                        <p className="text-sm text-muted-foreground">出場試合</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 医療情報 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>医療・健康情報</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={playerStats.medicalNotes}
                      onChange={(e) => setPlayerStats({ ...playerStats, medicalNotes: e.target.value })}
                      placeholder="医療情報、アレルギー、既往歴など..."
                      rows={4}
                    />
                  ) : (
                    <p className="text-muted-foreground">{playerStats.medicalNotes || "記録なし"}</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 記録タブ */}
            <TabsContent value="notes" className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">選手記録</h3>
                <Button onClick={() => setShowAddNote(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  新しい記録を追加
                </Button>
              </div>

              {/* 新しい記録追加フォーム */}
              {showAddNote && (
                <Card>
                  <CardHeader>
                    <CardTitle>新しい記録を追加</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="noteTitle">タイトル</Label>
                      <Input
                        id="noteTitle"
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                        placeholder="記録のタイトルを入力..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="noteCategory">カテゴリ</Label>
                      <select
                        id="noteCategory"
                        className="w-full p-2 border rounded-md"
                        value={newNote.category}
                        onChange={(e) => setNewNote({ ...newNote, category: e.target.value as PlayerNote["category"] })}
                      >
                        <option value="performance">パフォーマンス</option>
                        <option value="training">練習</option>
                        <option value="medical">医療</option>
                        <option value="personal">個人</option>
                        <option value="tactical">戦術</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="noteDate">日付</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(newNote.date, "PPP", { locale: ja })}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newNote.date}
                            onSelect={(date) => date && setNewNote({ ...newNote, date })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="noteContent">内容</Label>
                      <Textarea
                        id="noteContent"
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                        placeholder="記録の詳細を入力..."
                        rows={4}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleAddNote}>
                        <Save className="h-4 w-4 mr-2" />
                        保存
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddNote(false)}>
                        キャンセル
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 記録一覧 */}
              <div className="space-y-4">
                {notes.map((note) => (
                  <Card key={note.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge className={categoryColors[note.category]}>{categoryLabels[note.category]}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {format(note.date, "yyyy年MM月dd日", { locale: ja })}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteNote(note.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardTitle className="text-lg">{note.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap">{note.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* 統計タブ */}
            <TabsContent value="stats" className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>月別パフォーマンス</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>1月</span>
                        <div className="flex space-x-2">
                          <Badge variant="outline">3得点</Badge>
                          <Badge variant="outline">2アシスト</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>12月</span>
                        <div className="flex space-x-2">
                          <Badge variant="outline">5得点</Badge>
                          <Badge variant="outline">1アシスト</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>11月</span>
                        <div className="flex space-x-2">
                          <Badge variant="outline">2得点</Badge>
                          <Badge variant="outline">3アシスト</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>ポジション別出場時間</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>{player.position}</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 目標タブ */}
            <TabsContent value="goals" className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>今シーズンの目標</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">得点目標</h4>
                      <div className="flex items-center justify-between">
                        <span>現在: {player.goals}得点</span>
                        <span className="text-muted-foreground">目標: 20得点</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(player.goals / 20) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">アシスト目標</h4>
                      <div className="flex items-center justify-between">
                        <span>現在: {player.assists}アシスト</span>
                        <span className="text-muted-foreground">目標: 15アシスト</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(player.assists / 15) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">個人目標・改善点</h4>
                    <Textarea
                      placeholder="個人的な目標や改善したいスキルを記録..."
                      rows={4}
                      defaultValue="シュート精度の向上、左足でのシュート練習、守備時のポジショニング改善"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
