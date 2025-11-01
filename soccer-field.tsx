"use client"

import type React from "react"

import { useState } from "react"

interface Player {
  id: number
  name: string
  position: string
  number: number
  x: number
  y: number
}

interface SoccerFieldProps {
  showOpponentTeam?: boolean
  setShowOpponentTeam?: (show: boolean) => void
}

export function SoccerField({ showOpponentTeam = false, setShowOpponentTeam }: SoccerFieldProps) {
  const [fieldPlayers, setFieldPlayers] = useState<Player[]>([
    // GK
    { id: 1, name: "田中", position: "GK", number: 1, x: 50, y: 90 },
    // DF (4-4-2 formation) - 下半分
    { id: 2, name: "佐藤", position: "DF", number: 2, x: 20, y: 75 },
    { id: 3, name: "鈴木", position: "DF", number: 3, x: 40, y: 75 },
    { id: 4, name: "高橋", position: "DF", number: 4, x: 60, y: 75 },
    { id: 5, name: "伊藤", position: "DF", number: 5, x: 80, y: 75 },
    // MF - 下半分
    { id: 6, name: "渡辺", position: "MF", number: 6, x: 20, y: 65 },
    { id: 7, name: "山本", position: "MF", number: 7, x: 40, y: 65 },
    { id: 8, name: "中村", position: "MF", number: 8, x: 60, y: 65 },
    { id: 9, name: "小林", position: "MF", number: 9, x: 80, y: 65 },
    // FW - 下半分
    { id: 10, name: "加藤", position: "FW", number: 10, x: 35, y: 55 },
    { id: 11, name: "吉田", position: "FW", number: 11, x: 65, y: 55 },
  ])

  const opponentPlayers: Player[] = [
    // 相手チーム GK - 上半分
    { id: 101, name: "山田", position: "GK", number: 1, x: 50, y: 10 },
    // 相手チーム DF - 上半分
    { id: 102, name: "田村", position: "DF", number: 2, x: 20, y: 25 },
    { id: 103, name: "石川", position: "DF", number: 3, x: 40, y: 25 },
    { id: 104, name: "松田", position: "DF", number: 4, x: 60, y: 25 },
    { id: 105, name: "橋本", position: "DF", number: 5, x: 80, y: 25 },
    // 相手チーム MF - 上半分
    { id: 106, name: "青木", position: "MF", number: 6, x: 20, y: 35 },
    { id: 107, name: "森田", position: "MF", number: 7, x: 40, y: 35 },
    { id: 108, name: "岡田", position: "MF", number: 8, x: 60, y: 35 },
    { id: 109, name: "長谷川", position: "MF", number: 9, x: 80, y: 35 },
    // 相手チーム FW - 上半分
    { id: 110, name: "近藤", position: "FW", number: 10, x: 35, y: 45 },
    { id: 111, name: "藤田", position: "FW", number: 11, x: 65, y: 45 },
  ]

  const initialBenchPlayers: Player[] = [
    { id: 12, name: "松本", position: "GK", number: 12, x: 120, y: 20 },
    { id: 13, name: "井上", position: "DF", number: 13, x: 120, y: 30 },
    { id: 14, name: "木村", position: "MF", number: 14, x: 120, y: 40 },
    { id: 15, name: "林", position: "FW", number: 15, x: 120, y: 50 },
    { id: 16, name: "斎藤", position: "DF", number: 16, x: 120, y: 60 },
    { id: 17, name: "清水", position: "MF", number: 17, x: 120, y: 70 },
    { id: 18, name: "森", position: "FW", number: 18, x: 120, y: 80 },
  ]
  const [benchPlayersState, setBenchPlayersState] = useState<Player[]>(initialBenchPlayers)

  const opponentBenchPlayers: Player[] = [
    { id: 112, name: "中島", position: "GK", number: 12, x: 15, y: 20 },
    { id: 113, name: "西田", position: "DF", number: 13, x: 15, y: 30 },
    { id: 114, name: "東", position: "MF", number: 14, x: 15, y: 40 },
    { id: 115, name: "南", position: "FW", number: 15, x: 15, y: 50 },
    { id: 116, name: "北", position: "DF", number: 16, x: 15, y: 60 },
    { id: 117, name: "上田", position: "MF", number: 17, x: 15, y: 70 },
    { id: 118, name: "下村", position: "FW", number: 18, x: 15, y: 80 },
  ]

  const [draggedPlayer, setDraggedPlayer] = useState<number | null>(null)
  const [substitutions, setSubstitutions] = useState<
    Array<{ from: number; to: number; time: string; action?: string }>
  >([])
  const [draggedFromBench, setDraggedFromBench] = useState<boolean>(false)
  const [selectedFieldPlayer, setSelectedFieldPlayer] = useState<number | null>(null)
  const [selectedBenchPlayer, setSelectedBenchPlayer] = useState<number | null>(null)
  const [substitutionCount, setSubstitutionCount] = useState(0)
  const [showSubstitutionDialog, setShowSubstitutionDialog] = useState(false)
  const maxSubstitutions = 5
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const handlePlayerSelection = (playerId: number, isOnField: boolean) => {
    if (isOnField) {
      setSelectedFieldPlayer(selectedFieldPlayer === playerId ? null : playerId)
      setSelectedBenchPlayer(null)
    } else {
      setSelectedBenchPlayer(selectedBenchPlayer === playerId ? null : playerId)
      setSelectedFieldPlayer(null)
    }
  }

  const executeSubstitution = () => {
    if (selectedFieldPlayer && selectedBenchPlayer && substitutionCount < maxSubstitutions) {
      const fieldPlayerToReplace = fieldPlayers.find((p) => p.id === selectedFieldPlayer)
      const benchPlayerToEnter =
        benchPlayersState.find((p) => p.id === selectedBenchPlayer) ||
        opponentBenchPlayers.find((p) => p.id === selectedBenchPlayer)

      if (fieldPlayerToReplace && benchPlayerToEnter) {
        // 1. Remove fieldPlayerToReplace from fieldPlayers and add to benchPlayersState
        setFieldPlayers((prev) => prev.filter((p) => p.id !== fieldPlayerToReplace.id))
        // Only add to benchPlayersState if it's our team's player
        if (fieldPlayerToReplace.id < 100) {
          const originalBenchPos = initialBenchPlayers.find((p) => p.id === fieldPlayerToReplace.id)
          setBenchPlayersState((prev) => [
            ...prev,
            { ...fieldPlayerToReplace, x: originalBenchPos?.x || 120, y: originalBenchPos?.y || 50 },
          ])
        }

        // 2. Remove benchPlayerToEnter from benchPlayersState and add to fieldPlayers
        if (benchPlayerToEnter.id < 100) {
          setBenchPlayersState((prev) => prev.filter((p) => p.id !== benchPlayerToEnter.id))
        }
        setFieldPlayers((prev) => [
          ...prev,
          { ...benchPlayerToEnter, x: fieldPlayerToReplace.x, y: fieldPlayerToReplace.y },
        ])

        // 交代記録を追加
        const now = new Date()
        setSubstitutions((prev) => [
          ...prev,
          {
            from: selectedFieldPlayer,
            to: selectedBenchPlayer,
            time: `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`,
            action: `交代: ${fieldPlayerToReplace.name} → ${benchPlayerToEnter.name}`,
          },
        ])

        setSubstitutionCount((prev) => prev + 1)
        setSelectedFieldPlayer(null)
        setSelectedBenchPlayer(null)
        setShowSubstitutionDialog(false)
      }
    }
  }

  const handleMouseDown = (playerId: number, fromBench = false, e?: React.MouseEvent) => {
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect()
      // SVGのviewBox座標系に正確に変換
      const mouseX = ((e.clientX - rect.left) / rect.width) * 140
      const mouseY = ((e.clientY - rect.top) / rect.height) * 100

      const player =
        fieldPlayers.find((p) => p.id === playerId) ||
        benchPlayersState.find((p) => p.id === playerId) ||
        opponentBenchPlayers.find((p) => p.id === playerId)

      if (player) {
        setDragOffset({
          x: mouseX - player.x,
          y: mouseY - player.y,
        })
      }
    }

    setDraggedPlayer(playerId)
    setDraggedFromBench(fromBench)
  }

  const handleMouseMove = (e: React.MouseEvent<SVGElement>) => {
    if (draggedPlayer === null) return

    const rect = e.currentTarget.getBoundingClientRect()
    // viewBox座標系に変換
    const mouseX = ((e.clientX - rect.left) / rect.width) * 140
    const mouseY = ((e.clientY - rect.top) / rect.height) * 100

    // ドラッグオフセットを適用した実際の位置
    const targetX = mouseX - dragOffset.x
    const targetY = mouseY - dragOffset.y

    // ベンチエリアの判定
    const isInOwnBench = mouseX >= 105 && mouseX <= 135 && mouseY >= 10 && mouseY <= 90
    const isInOpponentBench = mouseX >= 5 && mouseX <= 35 && mouseY >= 10 && mouseY <= 90

    if (draggedFromBench) {
      // ベンチからフィールドへの投入
      // フィールド内（0-100の範囲）に制限
      const clampedX = Math.max(5, Math.min(95, targetX))
      let clampedY = targetY

      if (draggedPlayer < 100) {
        // 自チーム：下半分（50-95）
        clampedY = Math.max(52, Math.min(95, targetY))
      } else {
        // 相手チーム：上半分（5-48）
        clampedY = Math.max(5, Math.min(48, targetY))
      }

      const benchPlayer =
        benchPlayersState.find((p) => p.id === draggedPlayer) ||
        opponentBenchPlayers.find((p) => p.id === draggedPlayer)

      if (benchPlayer) {
        if (!fieldPlayers.find((p) => p.id === draggedPlayer)) {
          setFieldPlayers((prev) => [...prev, { ...benchPlayer, x: clampedX, y: clampedY }])
          if (benchPlayer.id < 100) {
            // Only remove from our bench if it's our player
            setBenchPlayersState((prev) => prev.filter((p) => p.id !== draggedPlayer))
          }
        } else {
          setFieldPlayers((prev) =>
            prev.map((player) => (player.id === draggedPlayer ? { ...player, x: clampedX, y: clampedY } : player)),
          )
        }
      }
    } else {
      // フィールド選手の移動
      if ((isInOwnBench && draggedPlayer < 100) || (isInOpponentBench && draggedPlayer >= 100)) {
        return
      }

      // フィールド内（0-100の範囲）に制限
      const clampedX = Math.max(5, Math.min(95, targetX))
      let clampedY = targetY

      if (draggedPlayer < 100) {
        // 自チーム：下半分（50-95）
        clampedY = Math.max(50, Math.min(98, targetY))
      } else {
        // 相手チーム：上半分（5-48）
        clampedY = Math.max(5, Math.min(48, targetY))
      }

      setFieldPlayers((prev) =>
        prev.map((player) => (player.id === draggedPlayer ? { ...player, x: clampedX, y: clampedY } : player)),
      )
    }
  }

  const handleMouseUp = (e?: React.MouseEvent<SVGElement>) => {
    if (draggedPlayer === null) return

    if (e) {
      const rect = e.currentTarget.getBoundingClientRect()
      const mouseX = ((e.clientX - rect.left) / rect.width) * 140
      const mouseY = ((e.clientY - rect.top) / rect.height) * 100

      // ベンチエリアの判定
      const isInOwnBench = mouseX >= 105 && mouseX <= 135 && mouseY >= 10 && mouseY <= 90
      const isInOpponentBench = mouseX >= 5 && mouseX <= 35 && mouseY >= 10 && mouseY <= 90

      // フィールド選手をベンチに戻す
      if (!draggedFromBench) {
        if ((isInOwnBench && draggedPlayer < 100) || (isInOpponentBench && draggedPlayer >= 100)) {
          const playerToMoveToBench = fieldPlayers.find((p) => p.id === draggedPlayer)
          if (playerToMoveToBench) {
            setFieldPlayers((prev) => prev.filter((p) => p.id !== draggedPlayer))

            // Add to benchPlayersState, maintaining its original bench coordinates if possible, or default
            if (playerToMoveToBench.id < 100) {
              // Only add to our bench if it's our player
              const originalBenchPos = initialBenchPlayers.find((p) => p.id === draggedPlayer)
              setBenchPlayersState((prev) => [
                ...prev,
                { ...playerToMoveToBench, x: originalBenchPos?.x || 120, y: originalBenchPos?.y || 50 },
              ])
            }
          }

          const now = new Date()
          const playerName = fieldPlayers.find((p) => p.id === draggedPlayer)?.name || "選手"
          setSubstitutions((prev) => [
            ...prev,
            {
              from: draggedPlayer,
              to: 0,
              time: `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`,
              action: `${playerName} ベンチに戻る`,
            },
          ])
        }
      }
    }

    setDraggedPlayer(null)
    setDraggedFromBench(false)
    setDragOffset({ x: 0, y: 0 })
  }

  const handleSubstitution = (benchPlayerId: number, fieldPlayerId: number) => {
    const benchPlayer =
      benchPlayersState.find((p) => p.id === benchPlayerId) || opponentBenchPlayers.find((p) => p.id === benchPlayerId)
    const fieldPlayer = fieldPlayers.find((p) => p.id === fieldPlayerId)

    if (benchPlayer && fieldPlayer) {
      // This function is not currently used in the UI for direct substitution,
      // the logic is in executeSubstitution. Keeping it for completeness if it were to be used.
      // If used, it would need to update fieldPlayers and benchPlayersState.
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <svg
        viewBox="0 0 140 100"
        className="w-full h-auto bg-green-500 border-2 border-white rounded-lg cursor-pointer"
        style={{ aspectRatio: "1.5/1" }}
        onMouseMove={handleMouseMove}
        onMouseUp={(e) => handleMouseUp(e)}
        onMouseLeave={handleMouseUp}
      >
        {/* フィールドの背景 */}
        <defs>
          <pattern id="grass" patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="4" height="4" fill="#22c55e" />
            <rect width="2" height="2" fill="#16a34a" />
            <rect x="2" y="2" width="2" height="2" fill="#16a34a" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grass)" />

        {/* フィールドの境界線 */}
        <rect x="2" y="2" width="96" height="96" fill="none" stroke="white" strokeWidth="0.3" />

        {/* ハーフライン強調 */}
        <line x1="2" y1="50" x2="98" y2="50" stroke="white" strokeWidth="0.5" strokeDasharray="2,1" />
        <text
          x="50"
          y="48"
          textAnchor="middle"
          fontSize="2"
          fill="white"
          fontWeight="bold"
          className="pointer-events-none select-none"
        >
          自チーム
        </text>
        <text
          x="50"
          y="52"
          textAnchor="middle"
          fontSize="2"
          fill="white"
          fontWeight="bold"
          className="pointer-events-none select-none"
        >
          相手チーム
        </text>

        {/* センターサークル */}
        <circle cx="50" cy="50" r="8" fill="none" stroke="white" strokeWidth="0.3" />
        <circle cx="50" cy="50" r="0.5" fill="white" />

        {/* ペナルティエリア（上） */}
        <rect x="25" y="2" width="50" height="15" fill="none" stroke="white" strokeWidth="0.3" />
        {/* ゴールエリア（上） */}
        <rect x="37.5" y="2" width="25" height="6" fill="none" stroke="white" strokeWidth="0.3" />
        {/* ペナルティスポット（上） */}
        <circle cx="50" cy="10" r="0.5" fill="white" />
        {/* ペナルティアーク（上） */}
        <path d="M 35 17 A 8 8 0 0 1 65 17" fill="none" stroke="white" strokeWidth="0.3" />

        {/* ペナルティエリア（下） */}
        <rect x="25" y="83" width="50" height="15" fill="none" stroke="white" strokeWidth="0.3" />
        {/* ゴールエリア（下） */}
        <rect x="37.5" y="92" width="25" height="6" fill="none" stroke="white" strokeWidth="0.3" />
        {/* ペナルティスポット（下） */}
        <circle cx="50" cy="90" r="0.5" fill="white" />
        {/* ペナルティアーク（下） */}
        <path d="M 35 83 A 8 8 0 0 0 65 83" fill="none" stroke="white" strokeWidth="0.3" />

        {/* ゴール（上） */}
        <rect x="45" y="0" width="10" height="2" fill="none" stroke="white" strokeWidth="0.3" />
        {/* ゴール（下） */}
        <rect x="45" y="98" width="10" height="2" fill="none" stroke="white" strokeWidth="0.3" />

        {/* コーナーアーク */}
        <path d="M 2 5 A 3 3 0 0 1 5 2" fill="none" stroke="white" strokeWidth="0.3" />
        <path d="M 95 2 A 3 3 0 0 1 98 5" fill="none" stroke="white" strokeWidth="0.3" />
        <path d="M 98 95 A 3 3 0 0 1 95 98" fill="none" stroke="white" strokeWidth="0.3" />
        <path d="M 5 98 A 3 3 0 0 1 2 95" fill="none" stroke="white" strokeWidth="0.3" />

        {/* 選手 */}
        {fieldPlayers.map((player) => (
          <g key={player.id}>
            {/* 選手の影 */}
            <circle cx={player.x + 0.5} cy={player.y + 0.5} r="2.5" fill="rgba(0,0,0,0.3)" />
            {/* 選手 */}
            <circle
              cx={player.x}
              cy={player.y}
              r="2.5"
              fill={player.position === "GK" ? "#f59e0b" : "#3b82f6"}
              stroke={selectedFieldPlayer === player.id ? "#fbbf24" : "white"}
              strokeWidth={selectedFieldPlayer === player.id ? "0.8" : "0.3"}
              className="cursor-move hover:stroke-2 transition-all"
              onMouseDown={(e) => handleMouseDown(player.id, false, e)}
              onClick={(e) => {
                e.stopPropagation()
                handlePlayerSelection(player.id, true)
              }}
            />
            {/* 背番号 */}
            <text
              x={player.x}
              y={player.y + 0.5}
              textAnchor="middle"
              fontSize="2"
              fill="white"
              fontWeight="bold"
              className="pointer-events-none select-none"
            >
              {player.number}
            </text>
            {/* 選手名 */}
            <text
              x={player.x}
              y={player.y - 4}
              textAnchor="middle"
              fontSize="1.5"
              fill="white"
              fontWeight="bold"
              className="pointer-events-none select-none"
              style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
            >
              {player.name}
            </text>
          </g>
        ))}
        {/* 相手チーム選手 */}
        {showOpponentTeam &&
          opponentPlayers.map((player) => (
            <g key={player.id}>
              {/* 選手の影 */}
              <circle cx={player.x + 0.5} cy={player.y + 0.5} r="2.5" fill="rgba(0,0,0,0.3)" />
              {/* 選手 */}
              <circle
                cx={player.x}
                cy={player.y}
                r="2.5"
                fill={player.position === "GK" ? "#dc2626" : "#ef4444"}
                stroke="white"
                strokeWidth="0.3"
                className="cursor-move hover:stroke-2 transition-all"
                onMouseDown={(e) => handleMouseDown(player.id, false, e)}
              />
              {/* 背番号 */}
              <text
                x={player.x}
                y={player.y + 0.5}
                textAnchor="middle"
                fontSize="2"
                fill="white"
                fontWeight="bold"
                className="pointer-events-none select-none"
              >
                {player.number}
              </text>
              {/* 選手名 */}
              <text
                x={player.x}
                y={player.y - 4}
                textAnchor="middle"
                fontSize="1.5"
                fill="white"
                fontWeight="bold"
                className="pointer-events-none select-none"
                style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
              >
                {player.name}
              </text>
            </g>
          ))}

        {/* ベンチエリア */}
        <rect
          x="105"
          y="10"
          width="30"
          height="80"
          fill="rgba(139, 69, 19, 0.3)"
          stroke="white"
          strokeWidth="0.3"
          rx="2"
        />
        <text x="120" y="8" textAnchor="middle" fontSize="2" fill="white" fontWeight="bold">
          ベンチ
        </text>

        {/* ベンチの座席 */}
        {Array.from({ length: 7 }, (_, i) => (
          <rect
            key={i}
            x="107"
            y={15 + i * 10}
            width="26"
            height="8"
            fill="rgba(139, 69, 19, 0.5)"
            stroke="white"
            strokeWidth="0.2"
            rx="1"
          />
        ))}

        {/* ベンチメンバー */}
        {benchPlayersState // Changed from benchPlayers
          .filter((player) => !fieldPlayers.find((p) => p.id === player.id)) // Ensure player is not on field
          .map((player) => (
            <g key={player.id}>
              <circle cx={player.x + 0.3} cy={player.y + 0.3} r="2" fill="rgba(0,0,0,0.3)" />
              <circle
                cx={player.x}
                cy={player.y}
                r="2"
                fill={player.position === "GK" ? "#f59e0b" : "#6b7280"}
                stroke={selectedBenchPlayer === player.id ? "#fbbf24" : "white"}
                strokeWidth={selectedBenchPlayer === player.id ? "0.6" : "0.2"}
                className="cursor-pointer hover:stroke-2 transition-all"
                onMouseDown={(e) => handleMouseDown(player.id, true, e)}
                onClick={(e) => {
                  e.stopPropagation()
                  handlePlayerSelection(player.id, false)
                }}
              />
              <text
                x={player.x}
                y={player.y + 0.3}
                textAnchor="middle"
                fontSize="1.5"
                fill="white"
                fontWeight="bold"
                className="pointer-events-none select-none"
              >
                {player.number}
              </text>
              <text
                x={player.x}
                y={player.y - 3}
                textAnchor="middle"
                fontSize="1.2"
                fill="white"
                fontWeight="bold"
                className="pointer-events-none select-none"
                style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
              >
                {player.name}
              </text>
            </g>
          ))}

        {showOpponentTeam && (
          <>
            {/* 相手チームベンチエリア */}
            <rect
              x="5"
              y="10"
              width="30"
              height="80"
              fill="rgba(220, 38, 38, 0.3)"
              stroke="white"
              strokeWidth="0.3"
              rx="2"
            />
            <text x="20" y="8" textAnchor="middle" fontSize="2" fill="white" fontWeight="bold">
              相手ベンチ
            </text>

            {/* 相手チームベンチの座席 */}
            {Array.from({ length: 7 }, (_, i) => (
              <rect
                key={i}
                x="7"
                y={15 + i * 10}
                width="26"
                height="8"
                fill="rgba(220, 38, 38, 0.5)"
                stroke="white"
                strokeWidth="0.2"
                rx="1"
              />
            ))}

            {/* 相手チームベンチメンバー */}
            {opponentBenchPlayers
              .filter((player) => !fieldPlayers.find((p) => p.id === player.id)) // Ensure player is not on field
              .map((player) => (
                <g key={player.id}>
                  <circle cx={player.x + 0.3} cy={player.y + 0.3} r="2" fill="rgba(0,0,0,0.3)" />
                  <circle
                    cx={player.x}
                    cy={player.y}
                    r="2"
                    fill={player.position === "GK" ? "#dc2626" : "#ef4444"}
                    stroke="white"
                    strokeWidth="0.2"
                    className="cursor-pointer hover:stroke-2 transition-all"
                    onMouseDown={(e) => handleMouseDown(player.id, true, e)}
                  />
                  <text
                    x={player.x}
                    y={player.y + 0.3}
                    textAnchor="middle"
                    fontSize="1.5"
                    fill="white"
                    fontWeight="bold"
                    className="pointer-events-none select-none"
                  >
                    {player.number}
                  </text>
                  <text
                    x={player.x}
                    y={player.y - 3}
                    textAnchor="middle"
                    fontSize="1.2"
                    fill="white"
                    fontWeight="bold"
                    className="pointer-events-none select-none"
                    style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
                  >
                    {player.name}
                  </text>
                </g>
              ))}
          </>
        )}
        {/* ベンチドロップゾーン表示 */}
        {draggedPlayer !== null && !draggedFromBench && draggedPlayer < 100 && (
          <rect
            x="105"
            y="10"
            width="30"
            height="80"
            fill="rgba(59, 130, 246, 0.3)"
            stroke="#3b82f6"
            strokeWidth="0.5"
            strokeDasharray="2,2"
            rx="2"
          />
        )}

        {draggedPlayer !== null && !draggedFromBench && draggedPlayer >= 100 && showOpponentTeam && (
          <rect
            x="5"
            y="10"
            width="30"
            height="80"
            fill="rgba(239, 68, 68, 0.3)"
            stroke="#ef4444"
            strokeWidth="0.5"
            strokeDasharray="2,2"
            rx="2"
          />
        )}
      </svg>

      {/* 交代コントロール */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <span className="font-semibold">交代回数: </span>
            <span className={substitutionCount >= maxSubstitutions ? "text-red-500" : "text-green-600"}>
              {substitutionCount}/{maxSubstitutions}
            </span>
          </div>
          {selectedFieldPlayer && selectedBenchPlayer && (
            <button
              onClick={() => setShowSubstitutionDialog(true)}
              disabled={substitutionCount >= maxSubstitutions}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              交代実行
            </button>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          {selectedFieldPlayer ? "フィールド選手選択済み" : "フィールド選手をクリック"} •
          {selectedBenchPlayer ? "ベンチ選手選択済み" : "ベンチ選手をクリック"}
        </div>
      </div>

      {/* 交代確認ダイアログ */}
      {showSubstitutionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">交代確認</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span>退場:</span>
                <span className="font-medium">
                  {fieldPlayers.find((p) => p.id === selectedFieldPlayer)?.name} (#
                  {fieldPlayers.find((p) => p.id === selectedFieldPlayer)?.number})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>投入:</span>
                <span className="font-medium">
                  {
                    (
                      benchPlayersState.find((p) => p.id === selectedBenchPlayer) ||
                      opponentBenchPlayers.find((p) => p.id === selectedBenchPlayer)
                    )?.name
                  }
                  (#
                  {
                    (
                      benchPlayersState.find((p) => p.id === selectedBenchPlayer) ||
                      opponentBenchPlayers.find((p) => p.id === selectedBenchPlayer)
                    )?.number
                  }
                  )
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                残り交代回数: {maxSubstitutions - substitutionCount - 1}回
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSubstitutionDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={executeSubstitution}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                交代実行
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>選手をドラッグしてフォーメーションを調整できます</p>
        <div className="flex items-center justify-center space-x-4 mt-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 border border-white"></div>
            <span>自チーム</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-amber-500 border border-white"></div>
            <span>自チーム GK</span>
          </div>
          {showOpponentTeam && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-red-500 border border-white"></div>
                <span>相手チーム</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-red-600 border border-white"></div>
                <span>相手チーム GK</span>
              </div>
            </>
          )}
        </div>
      </div>
      {substitutions.length > 0 && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">交代履歴</h4>
          {substitutions.map((sub, index) => (
            <div key={index} className="text-sm text-muted-foreground">
              {sub.time}: {sub.action || `#${sub.from} → #${sub.to}`}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
