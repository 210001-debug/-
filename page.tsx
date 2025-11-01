"use client"

import { useState } from "react"
import { CalendarIcon, Users, Trophy, BarChart3, Settings, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { SoccerField } from "@/components/soccer-field"
import { PlayerDocument } from "@/components/player-document"

const players = [
  { id: 1, name: "田中 太郎", position: "GK", number: 1, goals: 0, assists: 1, matches: 25 },
  { id: 2, name: "佐藤 次郎", position: "DF", number: 2, goals: 2, assists: 3, matches: 24 },
  { id: 3, name: "鈴木 三郎", position: "DF", number: 3, goals: 1, assists: 2, matches: 23 },
  { id: 4, name: "高橋 四郎", position: "DF", number: 4, goals: 3, assists: 1, matches: 22 },
  { id: 5, name: "伊藤 五郎", position: "DF", number: 5, goals: 1, assists: 4, matches: 21 },
  { id: 6, name: "渡辺 六郎", position: "MF", number: 6, goals: 4, assists: 6, matches: 24 },
  { id: 7, name: "山本 七郎", position: "MF", number: 7, goals: 6, assists: 8, matches: 23 },
  { id: 8, name: "中村 八郎", position: "MF", number: 8, goals: 7, assists: 12, matches: 20 },
  { id: 9, name: "小林 九郎", position: "MF", number: 9, goals: 5, assists: 7, matches: 22 },
  { id: 10, name: "加藤 十郎", position: "FW", number: 10, goals: 15, assists: 8, matches: 22 },
  { id: 11, name: "吉田 十一", position: "FW", number: 11, goals: 12, assists: 5, matches: 21 },
  { id: 12, name: "松本 十二", position: "GK", number: 12, goals: 0, assists: 0, matches: 5 },
  { id: 13, name: "井上 十三", position: "DF", number: 13, goals: 1, assists: 1, matches: 15 },
  { id: 14, name: "木村 十四", position: "MF", number: 14, goals: 3, assists: 4, matches: 18 },
  { id: 15, name: "林 十五", position: "FW", number: 15, goals: 8, assists: 3, matches: 19 },
  { id: 16, name: "斎藤 十六", position: "DF", number: 16, goals: 0, assists: 2, matches: 12 },
  { id: 17, name: "清水 十七", position: "MF", number: 17, goals: 2, assists: 3, matches: 14 },
  { id: 18, name: "森 十八", position: "FW", number: 18, goals: 4, assists: 2, matches: 16 },
]

export default function SoccerManagementApp() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [calendarView, setCalendarView] = useState<"list" | "calendar">("list")
  const [showAddMatchDialog, setShowAddMatchDialog] = useState(false)
  const [showOpponentTeam, setShowOpponentTeam] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<(typeof players)[0] | null>(null)

  const matches = [
    { id: 1, opponent: "レッドイーグルス", date: "2024-01-15", time: "15:00", venue: "ホーム", result: "勝利 2-1" },
    {
      id: 2,
      opponent: "ブルーライオンズ",
      date: "2024-01-22",
      time: "14:00",
      venue: "アウェイ",
      result: "引き分け 1-1",
    },
    { id: 3, opponent: "グリーンタイガース", date: "2024-01-29", time: "16:00", venue: "ホーム", result: "敗北 0-2" },
    { id: 4, opponent: "イエローウルフス", date: "2024-02-05", time: "15:30", venue: "アウェイ", result: "未定" },
    { id: 5, opponent: "ブラックパンサーズ", date: "2024-02-12", time: "14:00", venue: "ホーム", result: "未定" },
    { id: 6, opponent: "ホワイトベアーズ", date: "2024-02-19", time: "16:00", venue: "アウェイ", result: "未定" },
    { id: 7, opponent: "シルバーホークス", date: "2024-02-26", time: "15:00", venue: "ホーム", result: "未定" },
  ]

  // 特定の日付に試合があるかチェック
  const getMatchesForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return matches.filter((match) => match.date === dateString)
  }

  // カレンダーの日付に試合がある場合のスタイリング
  const modifiers = {
    hasMatch: (date: Date) => getMatchesForDate(date).length > 0,
  }

  const modifiersStyles = {
    hasMatch: {
      backgroundColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      fontWeight: "bold",
    },
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Trophy className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">サッカーチーム管理</h1>
            </div>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>ダッシュボード</span>
            </TabsTrigger>
            <TabsTrigger value="players" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>選手管理</span>
            </TabsTrigger>
            <TabsTrigger value="matches" className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4" />
              <span>試合管理</span>
            </TabsTrigger>
            <TabsTrigger value="field" className="flex items-center space-x-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <circle cx="12" cy="12" r="3" />
                <path d="M2 10h4" />
                <path d="M18 10h4" />
                <path d="M2 14h4" />
                <path d="M18 14h4" />
              </svg>
              <span>フィールド</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>統計</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">総選手数</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">25</div>
                  <p className="text-xs text-muted-foreground">+2 先月から</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">今シーズン勝利数</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">勝率 60%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">総得点</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45</div>
                  <p className="text-xs text-muted-foreground">平均 2.3点/試合</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">次の試合</CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2日後</div>
                  <p className="text-xs text-muted-foreground">vs イエローウルフス</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>最近の試合結果</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {matches.slice(0, 3).map((match) => (
                      <div key={match.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{match.opponent}</p>
                          <p className="text-sm text-muted-foreground">{match.date}</p>
                        </div>
                        <Badge
                          variant={
                            match.result.includes("勝利")
                              ? "default"
                              : match.result.includes("引き分け")
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {match.result}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>トップスコアラー</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {players
                      .sort((a, b) => b.goals - a.goals)
                      .slice(0, 3)
                      .map((player, index) => (
                        <div key={player.id} className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                            {index + 1}
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{player.name}</p>
                            <p className="text-sm text-muted-foreground">{player.position}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{player.goals}得点</p>
                            <p className="text-sm text-muted-foreground">{player.assists}アシスト</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="players" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">選手管理</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                新しい選手を追加
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="選手を検索..." className="max-w-sm" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {players.map((player) => (
                <Card key={player.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="text-lg font-bold">{player.number}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{player.name}</CardTitle>
                        <CardDescription>{player.position}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center mb-4">
                      <div>
                        <p className="text-2xl font-bold text-primary">{player.goals}</p>
                        <p className="text-xs text-muted-foreground">得点</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">{player.assists}</p>
                        <p className="text-xs text-muted-foreground">アシスト</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">{player.matches}</p>
                        <p className="text-xs text-muted-foreground">出場</p>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-transparent"
                      variant="outline"
                      onClick={() => setSelectedPlayer(player)}
                    >
                      詳細を見る
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="matches" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">試合管理</h2>
              <div className="flex items-center space-x-2">
                <div className="flex rounded-lg border">
                  <Button
                    variant={calendarView === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCalendarView("list")}
                  >
                    リスト
                  </Button>
                  <Button
                    variant={calendarView === "calendar" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCalendarView("calendar")}
                  >
                    カレンダー
                  </Button>
                </div>
                <Button onClick={() => setShowAddMatchDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  新しい試合を追加
                </Button>
              </div>
            </div>

            {calendarView === "calendar" ? (
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>試合カレンダー</CardTitle>
                    <CardDescription>試合がある日は青色でハイライトされます</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      modifiers={modifiers}
                      modifiersStyles={modifiersStyles}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedDate
                        ? `${selectedDate.getFullYear()}年${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日の試合`
                        : "日付を選択してください"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedDate ? (
                      <div className="space-y-4">
                        {getMatchesForDate(selectedDate).length > 0 ? (
                          getMatchesForDate(selectedDate).map((match) => (
                            <div key={match.id} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-lg">vs {match.opponent}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {match.time} • {match.venue}
                                  </p>
                                </div>
                                <Badge
                                  variant={
                                    match.result === "未定"
                                      ? "outline"
                                      : match.result.includes("勝利")
                                        ? "default"
                                        : match.result.includes("引き分け")
                                          ? "secondary"
                                          : "destructive"
                                  }
                                >
                                  {match.result}
                                </Badge>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>この日に予定されている試合はありません</p>
                            <Button
                              variant="outline"
                              className="mt-4 bg-transparent"
                              onClick={() => setShowAddMatchDialog(true)}
                            >
                              試合を追加
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>カレンダーから日付を選択してください</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>試合スケジュール</CardTitle>
                  <CardDescription>今シーズンの全試合</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {matches.map((match) => (
                      <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="font-bold">{match.date}</p>
                            <p className="text-sm text-muted-foreground">{match.time}</p>
                          </div>
                          <div>
                            <p className="font-medium text-lg">vs {match.opponent}</p>
                            <p className="text-sm text-muted-foreground">{match.venue}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {match.result === "未定" ? (
                            <Badge variant="outline">{match.result}</Badge>
                          ) : (
                            <Badge
                              variant={
                                match.result.includes("勝利")
                                  ? "default"
                                  : match.result.includes("引き分け")
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {match.result}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="field" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">フィールド・フォーメーション</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant={showOpponentTeam ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowOpponentTeam(!showOpponentTeam)}
                >
                  相手チーム表示
                </Button>
                <Button variant="outline" size="sm">
                  4-4-2
                </Button>
                <Button variant="outline" size="sm">
                  4-3-3
                </Button>
                <Button variant="outline" size="sm">
                  3-5-2
                </Button>
                <Button>フォーメーション保存</Button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>サッカーフィールド</CardTitle>
                    <CardDescription>選手をドラッグしてフォーメーションを調整できます</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SoccerField showOpponentTeam={showOpponentTeam} setShowOpponentTeam={setShowOpponentTeam} />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>スターティングメンバー</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {players.slice(0, 11).map((player, index) => (
                        <div key={player.id} className="flex items-center space-x-3 p-2 border rounded-lg">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{player.name}</p>
                            <p className="text-xs text-muted-foreground">{player.position}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>ベンチメンバー</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {players.slice(11, 18).map((player, index) => (
                        <div key={player.id} className="flex items-center space-x-3 p-2 border rounded-lg opacity-75">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs">
                            {index + 12}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{player.name}</p>
                            <p className="text-xs text-muted-foreground">{player.position}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                {showOpponentTeam && (
                  <Card>
                    <CardHeader>
                      <CardTitle>相手チーム</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {[
                          { name: "山田", position: "GK", number: 1 },
                          { name: "田村", position: "DF", number: 2 },
                          { name: "石川", position: "DF", number: 3 },
                          { name: "松田", position: "DF", number: 4 },
                          { name: "橋本", position: "DF", number: 5 },
                          { name: "青木", position: "MF", number: 6 },
                          { name: "森田", position: "MF", number: 7 },
                          { name: "岡田", position: "MF", number: 8 },
                          { name: "長谷川", position: "MF", number: 9 },
                          { name: "近藤", position: "FW", number: 10 },
                          { name: "藤田", position: "FW", number: 11 },
                        ].map((player, index) => (
                          <div key={index} className="flex items-center space-x-3 p-2 border rounded-lg bg-red-50">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs">
                              {player.number}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{player.name}</p>
                              <p className="text-xs text-muted-foreground">{player.position}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <h2 className="text-2xl font-bold">統計情報</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>チーム成績</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>総試合数</span>
                      <span className="font-bold">20</span>
                    </div>
                    <div className="flex justify-between">
                      <span>勝利</span>
                      <span className="font-bold text-green-600">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>引き分け</span>
                      <span className="font-bold text-yellow-600">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>敗北</span>
                      <span className="font-bold text-red-600">3</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>勝率</span>
                      <span className="font-bold">60%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>得点・失点統計</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>総得点</span>
                      <span className="font-bold text-green-600">45</span>
                    </div>
                    <div className="flex justify-between">
                      <span>総失点</span>
                      <span className="font-bold text-red-600">28</span>
                    </div>
                    <div className="flex justify-between">
                      <span>得失点差</span>
                      <span className="font-bold text-green-600">+17</span>
                    </div>
                    <div className="flex justify-between">
                      <span>平均得点</span>
                      <span className="font-bold">2.3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>平均失点</span>
                      <span className="font-bold">1.4</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>ポジション別選手数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-primary">2</p>
                    <p className="text-sm text-muted-foreground">GK</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">8</p>
                    <p className="text-sm text-muted-foreground">DF</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">10</p>
                    <p className="text-sm text-muted-foreground">MF</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">5</p>
                    <p className="text-sm text-muted-foreground">FW</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 選手ドキュメントモーダル */}
      {selectedPlayer && <PlayerDocument player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />}
    </div>
  )
}
