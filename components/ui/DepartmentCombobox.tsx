'use client'

import { useEffect, useState } from 'react'
import { fetchDepartments } from '@/lib/data'
import { type Department } from '@/lib/types'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  ComboboxInput
} from '@/components/ui/combobox'

type DepartmentComboboxProps = {
  selectedDeptId: number | null
  setSelectedDeptId: (value: number | null) => void
}

export default function DepartmentCombobox({ selectedDeptId, setSelectedDeptId }: DepartmentComboboxProps) {
  const [departments, setDepartments] = useState<Department[]>([])

  useEffect(() => {
    fetchDepartments()
      .then(setDepartments)
      .catch(err => console.error('Failed to load departments:', err))
  }, [])

  const selected = departments.find(d => d.departmentId === selectedDeptId) ?? null

  return (
    <Combobox
      items={departments}
      value={selected?.displayName ?? ''} 
      onValueChange={value => {
        const dept = departments.find(d => d.displayName === value)
        setSelectedDeptId(dept ? dept.departmentId : null)
      }}
    >
      <ComboboxInput placeholder='Select a department' showClear />
      <ComboboxContent>
        <ComboboxEmpty>No departments found.</ComboboxEmpty>
        <ComboboxList>
          {(item: Department) => (
            <ComboboxItem key={item.departmentId} value={item.displayName}>
              {item.displayName}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
