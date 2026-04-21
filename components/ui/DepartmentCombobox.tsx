'use client'

import { useEffect, useState } from 'react'
import { fetchDepartments } from '@/lib/data'
import { type Department } from '@/lib/types'
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from '@/components/ui/combobox'


type DepartmentComboboxProps = {
  selectedDeptIds: number[]
  setSelectedDeptIds: (value: number[]) => void
}

export default function DepartmentCombobox({ selectedDeptIds, setSelectedDeptIds }: DepartmentComboboxProps) {
  const [departments, setDepartments] = useState<Department[]>([])

  useEffect(() => {
    fetchDepartments()
      .then(setDepartments)
      .catch(err => console.error('Failed to load departments:', err))
  }, [])

  const handleValueChange = (value: Department[]) => {
    setSelectedDeptIds(value.map(d => d.departmentId))
  }

  return (
    <Combobox
      items={departments}
      multiple
      value={departments.filter(d => selectedDeptIds.includes(d.departmentId))}
      onValueChange={handleValueChange}
    >
      <ComboboxChips className="overflow-hidden">
        <ComboboxValue placeholder="Select departments...">
          {(values: Department[]) => (
            <>
              {values.map((value: Department) => (
                <ComboboxChip key={value.departmentId}>{value.displayName}</ComboboxChip>
              ))}
              <ComboboxChipsInput />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent>
        <ComboboxEmpty>No departments found.</ComboboxEmpty>
        <ComboboxList>
          {(item: Department) => (
            <ComboboxItem key={item.departmentId} value={item}>
              {item.displayName}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
