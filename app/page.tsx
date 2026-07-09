"use client"

import { useState, useEffect, useCallback } from "react"
import { AnimatedGradientBg } from "@/components/animated-gradient-bg"
import { AnimatedButton } from "@/components/animated-button"
import { StatusCard, DataRow } from "@/components/status-card"
import { InteractiveIcon } from "@/components/interactive-icon"
import { PinModal, MathModal } from "@/components/pin-modal"
import { AlertBanner } from "@/components/alert-banner"
import { HistoryList, type HistoryItem } from "@/components/history-list"
import { ThresholdSlider } from "@/components/threshold-slider"
import { 
  Shield, 
  Wifi, 
  WifiOff, 
  Activity, 
  Lock, 
  Unlock, 
  Sun, 
  Key, 
  Siren, 
  BellOff,
  History,
  Gamepad2,
  Bluetooth,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck
} from "lucide-react"

// BLE Configuration
const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
const UART_TX_CHAR_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e"
const UART_RX_CHAR_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e"

export default function BrankasPage() {
  // BLE State
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [txCharacteristic, setTxCharacteristic] = useState<BluetoothRemoteGATTCharacteristic | null>(null)

  // Vault State
  const [lightValue, setLightValue] = useState("--")
  const [threshold, setThreshold] = useState(50)
  const [vaultStatus, setVaultStatus] = useState<"locked" | "unlocked" | "danger" | "safe">("locked")
  const [isAlarmActive, setIsAlarmActive] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  // PIN State
  const [systemPin, setSystemPin] = useState("1234")
  const [pinModalOpen, setPinModalOpen] = useState(false)
  const [mathModalOpen, setMathModalOpen] = useState(false)
  const [pinAction, setPinAction] = useState<"turnOff" | "verifyOldPin" | "enterNewPin">("turnOff")
  const [pinError, setPinError] = useState(false)
  const [mathError, setMathError] = useState(false)

  // History
  const [history, setHistory] = useState<HistoryItem[]>([])

  // Load from localStorage
  useEffect(() => {
    const savedPin = localStorage.getItem("vaultPin")
    const savedHistory = localStorage.getItem("vaultHistory")
    if (savedPin) setSystemPin(savedPin)
    if (savedHistory) setHistory(JSON.parse(savedHistory))
  }, [])

  // Add history entry
  const addHistory = useCallback((msg: string, type: HistoryItem["type"]) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    setHistory((prev) => {
      const newHistory = [{ time, msg, type }, ...prev].slice(0, 10)
      localStorage.setItem("vaultHistory", JSON.stringify(newHistory))
      return newHistory
    })
  }, [])

  // Process BLE messages
  const processMessage = useCallback((msg: string) => {
    if (msg.startsWith("CAHAYA:")) {
      setLightValue(msg.split(":")[1])
    }
    if (msg === "DIBUKA") {
      triggerAlarm("Pintu Terbuka!")
    }
    if (msg === "ALARM:GETAR") {
      triggerAlarm("Getaran Terdeteksi!")
    }
    if (msg === "DITUTUP") {
      if (!isAlarmActive) {
        setVaultStatus("locked")
      }
    }
  }, [isAlarmActive])

  // Trigger alarm
  const triggerAlarm = useCallback((reason: string) => {
    if (!isAlarmActive) {
      setIsAlarmActive(true)
      setAlertMessage(reason.toUpperCase())
      setVaultStatus("danger")
      addHistory(reason, "alert")
    }
  }, [isAlarmActive, addHistory])

  // Send BLE command
  const sendCommand = useCallback(async (cmd: string) => {
    if (txCharacteristic) {
      await txCharacteristic.writeValue(new TextEncoder().encode(cmd + "\n"))
    }
  }, [txCharacteristic])

  // Connect Bluetooth
  const connectBluetooth = async () => {
    setIsConnecting(true)
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: "BBC micro:bit" }],
        optionalServices: [UART_SERVICE_UUID]
      })
      
      const server = await device.gatt!.connect()
      const service = await server.getPrimaryService(UART_SERVICE_UUID)
      const txChar = await service.getCharacteristic(UART_TX_CHAR_UUID)
      const rxChar = await service.getCharacteristic(UART_RX_CHAR_UUID)
      
      await rxChar.startNotifications()
      rxChar.addEventListener("characteristicvaluechanged", (e) => {
        const val = new TextDecoder().decode((e.target as BluetoothRemoteGATTCharacteristic).value!).trim()
        processMessage(val)
      })
      
      setTxCharacteristic(txChar)
      setIsConnected(true)
      addHistory("Koneksi Berhasil", "info")
    } catch (err) {
      console.error("Bluetooth error:", err)
      addHistory("Gagal Terhubung", "alert")
    } finally {
      setIsConnecting(false)
    }
  }

  // Handle biometric auth
  const handleBiometric = async () => {
    try {
      const challenge = new Uint8Array(32)
      window.crypto.getRandomValues(challenge)
      
      await navigator.credentials.get({
        publicKey: { challenge, allowCredentials: [], userVerification: "required" }
      })
      
      handleAuthSuccess()
    } catch (err) {
      console.log("Biometric cancelled or error")
    }
  }

  // Handle auth success
  const handleAuthSuccess = () => {
    if (pinAction === "turnOff") {
      setIsAlarmActive(false)
      setAlertMessage("")
      setVaultStatus("safe")
      sendCommand("ALARM_OFF")
      addHistory("Alarm Dimatikan", "safe")
      setPinModalOpen(false)
      
      // Reset to locked after 2s
      setTimeout(() => setVaultStatus("locked"), 2000)
    } else if (pinAction === "verifyOldPin") {
      setPinAction("enterNewPin")
    }
  }

  // Handle PIN submit
  const handlePinSubmit = (pin: string) => {
    if (pinAction === "enterNewPin") {
      setSystemPin(pin)
      localStorage.setItem("vaultPin", pin)
      setPinModalOpen(false)
      addHistory("PIN Diperbarui", "safe")
      return
    }

    if (pin === systemPin) {
      setPinError(false)
      handleAuthSuccess()
    } else {
      setPinError(true)
      setTimeout(() => setPinError(false), 400)
    }
  }

  // Handle math submit
  const handleMathSubmit = (answer: string) => {
    const cleaned = answer.replace(/\s/g, "").toLowerCase()
    if (cleaned === "8√2" || cleaned === "8akar2") {
      setMathModalOpen(false)
      setPinAction("enterNewPin")
      setPinModalOpen(true)
    } else {
      setMathError(true)
      setTimeout(() => setMathError(false), 400)
    }
  }

  // Handle threshold change
  const handleThresholdChange = (value: number) => {
    setThreshold(value)
    sendCommand(`SET_LIMIT:${value}`)
  }

  // Handle manual siren
  const handleManualSiren = () => {
    if (confirm("Nyalakan sirine?")) {
      sendCommand("ALARM_ON")
      triggerAlarm("Sirine Manual")
    }
  }

  // Get vault status display
  const getVaultStatusDisplay = () => {
    switch (vaultStatus) {
      case "locked":
        return { text: "Terkunci", color: "success" as const, icon: Lock }
      case "unlocked":
        return { text: "Terbuka", color: "warning" as const, icon: Unlock }
      case "danger":
        return { text: "BAHAYA!", color: "destructive" as const, icon: AlertTriangle }
      case "safe":
        return { text: "Aman", color: "success" as const, icon: ShieldCheck }
    }
  }

  const statusDisplay = getVaultStatusDisplay()
  const StatusIcon = statusDisplay.icon

  return (
    <main className="relative min-h-screen pb-24">
      <AnimatedGradientBg />
      
      <div className="mx-auto max-w-md px-4 py-8">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="mb-5 flex items-center justify-center">
            <InteractiveIcon size="lg" glowColor="oklch(0.65 0.18 180)">
              <Shield className="h-8 w-8" />
            </InteractiveIcon>
          </div>
          <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground">
            Brankas Pintar
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Kontrol keamanan dengan autentikasi biometrik
          </p>
        </header>

        {/* Alert Banner */}
        <AlertBanner isVisible={isAlarmActive} message={alertMessage} />

        {/* Main Grid Layout */}
        <div className="mt-6 space-y-4">
          {/* Connection Card */}
          <StatusCard 
            title="Koneksi" 
            icon={<InteractiveIcon size="sm"><Bluetooth className="h-4 w-4" /></InteractiveIcon>}
            delay={0}
          >
            <AnimatedButton
              variant={isConnected ? "success" : "primary"}
              onClick={connectBluetooth}
              disabled={isConnected}
              loading={isConnecting}
              icon={isConnected ? <CheckCircle2 className="h-5 w-5" /> : <Wifi className="h-5 w-5" />}
            >
              {isConnected ? "Terhubung" : "Sambungkan ke Brankas"}
            </AnimatedButton>
          </StatusCard>

          {/* Status & Sensor - 2 column grid */}
          <StatusCard 
            title="Status & Sensor" 
            icon={<InteractiveIcon size="sm"><Activity className="h-4 w-4" /></InteractiveIcon>}
            delay={100}
          >
            <div className="grid grid-cols-2 gap-3">
              <DataRow
                label="Brankas"
                icon={<InteractiveIcon size="sm"><StatusIcon className="h-4 w-4" /></InteractiveIcon>}
                value={statusDisplay.text}
                valueColor={statusDisplay.color}
                compact
              />
              <DataRow
                label="Cahaya"
                icon={<InteractiveIcon size="sm"><Sun className="h-4 w-4" /></InteractiveIcon>}
                value={lightValue}
                valueColor="primary"
                compact
              />
            </div>
            <div className="mt-4">
              <ThresholdSlider
                label="Ambang Batas"
                icon={<Activity className="h-4 w-4" />}
                value={threshold}
                onChange={handleThresholdChange}
                disabled={!isConnected}
              />
            </div>
          </StatusCard>

          {/* Control Card - improved button layout */}
          <StatusCard 
            title="Kontrol Keamanan" 
            icon={<InteractiveIcon size="sm"><Gamepad2 className="h-4 w-4" /></InteractiveIcon>}
            delay={200}
          >
            <div className="space-y-3">
              <AnimatedButton
                variant="secondary"
                onClick={() => {
                  setPinAction("verifyOldPin")
                  setPinModalOpen(true)
                }}
                icon={<Key className="h-5 w-5" />}
              >
                Ganti PIN Web
              </AnimatedButton>
              
              <div className={`grid ${isAlarmActive ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
                <AnimatedButton
                  variant="destructive"
                  onClick={handleManualSiren}
                  disabled={!isConnected}
                  icon={<Siren className="h-5 w-5" />}
                  size={isAlarmActive ? "sm" : "md"}
                >
                  {isAlarmActive ? "SIRINE" : "SIRINE MANUAL"}
                </AnimatedButton>

                {isAlarmActive && (
                  <AnimatedButton
                    variant="success"
                    onClick={() => {
                      setPinAction("turnOff")
                      setPinModalOpen(true)
                    }}
                    icon={<BellOff className="h-5 w-5" />}
                    size="sm"
                  >
                    MATIKAN
                  </AnimatedButton>
                )}
              </div>
            </div>
          </StatusCard>

          {/* History Card */}
          <StatusCard 
            title="Riwayat" 
            icon={<InteractiveIcon size="sm"><History className="h-4 w-4" /></InteractiveIcon>}
            delay={300}
          >
            <HistoryList items={history} />
          </StatusCard>
        </div>

        {/* Watermark */}
        <div 
          className="fixed bottom-4 left-4 select-none text-xs tracking-widest text-foreground/15"
          style={{ fontFamily: "var(--font-orbitron), monospace" }}
        >
          ProjectAsyan
        </div>
      </div>

      {/* PIN Modal */}
      <PinModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onSubmit={handlePinSubmit}
        onBiometric={handleBiometric}
        title={pinAction === "enterNewPin" ? "Atur PIN Baru" : pinAction === "turnOff" ? "Matikan Alarm" : "Verifikasi PIN"}
        description={
          pinAction === "enterNewPin" 
            ? "Masukkan PIN baru (4-6 digit)" 
            : "Gunakan sidik jari atau PIN."
        }
        showBiometric={pinAction !== "enterNewPin"}
        showForgotPin={pinAction !== "enterNewPin"}
        onForgotPin={() => {
          setPinModalOpen(false)
          setMathModalOpen(true)
        }}
        error={pinError}
      />

      {/* Math Modal */}
      <MathModal
        isOpen={mathModalOpen}
        onClose={() => setMathModalOpen(false)}
        onSubmit={handleMathSubmit}
        error={mathError}
      />
    </main>
  )
}
