/**
 * Medical Example Component
 * Demonstrates privacy-preserving medical data handling
 */

'use client'

import { useState } from 'react'
import { useEncrypt, useDecrypt } from '@/hooks/useFHE'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export function MedicalExample() {
  const [patientAge, setPatientAge] = useState<string>('')
  const [bloodPressure, setBloodPressure] = useState<string>('')
  const [encryptedData, setEncryptedData] = useState<any>(null)
  const [decryptedData, setDecryptedData] = useState<any>(null)

  const { encrypt, isEncrypting } = useEncrypt()
  const { userDecrypt, isDecrypting } = useDecrypt()

  const handleEncryptData = async () => {
    if (!patientAge || !bloodPressure) return

    try {
      const encryptedAge = await encrypt(parseInt(patientAge))
      const encryptedBP = await encrypt(parseInt(bloodPressure))

      setEncryptedData({
        age: encryptedAge,
        bloodPressure: encryptedBP
      })
    } catch (error) {
      console.error('Encryption failed:', error)
    }
  }

  const handleDecryptData = async () => {
    if (!encryptedData) return

    try {
      const decryptedAge = await userDecrypt(encryptedData.age)
      const decryptedBP = await userDecrypt(encryptedData.bloodPressure)

      setDecryptedData({
        age: decryptedAge.toString(),
        bloodPressure: decryptedBP.toString()
      })
    } catch (error) {
      console.error('Decryption failed:', error)
    }
  }

  return (
    <Card>
      <h2>Medical Data Example</h2>
      <p className="description">
        Privacy-preserving patient information encryption
      </p>

      <div className="example-section">
        <h3>Encrypt Patient Data</h3>
        <Input
          type="number"
          value={patientAge}
          onChange={(e) => setPatientAge(e.target.value)}
          placeholder="Patient Age"
        />
        <Input
          type="number"
          value={bloodPressure}
          onChange={(e) => setBloodPressure(e.target.value)}
          placeholder="Blood Pressure (systolic)"
        />
        <Button onClick={handleEncryptData} disabled={isEncrypting}>
          {isEncrypting ? 'Encrypting...' : 'Encrypt Medical Data'}
        </Button>
        {encryptedData && (
          <div className="result">
            <strong>Data Encrypted</strong>
            <p>Age: {encryptedData.age.slice(0, 16)}...</p>
            <p>BP: {encryptedData.bloodPressure.slice(0, 16)}...</p>
          </div>
        )}
      </div>

      <div className="example-section">
        <h3>Decrypt Patient Data</h3>
        <Button onClick={handleDecryptData} disabled={isDecrypting || !encryptedData}>
          {isDecrypting ? 'Decrypting...' : 'Decrypt Medical Data'}
        </Button>
        {decryptedData && (
          <div className="result">
            <strong>Decrypted Data:</strong>
            <p>Age: {decryptedData.age} years</p>
            <p>Blood Pressure: {decryptedData.bloodPressure} mmHg</p>
          </div>
        )}
      </div>

      <div className="info-box">
        <p>
          <strong>Privacy Note:</strong> Medical data is encrypted end-to-end
          ensuring HIPAA compliance and patient privacy.
        </p>
      </div>
    </Card>
  )
}
