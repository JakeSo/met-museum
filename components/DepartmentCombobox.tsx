
import { fetchDepartments } from "@/app/lib/data"
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
} from "@/components/ui/combobox"

type Department = {
    departmentId: number,
    displayName: string
}

type DepartmentComboboxProps = {
    selectedDeptIds: number[],
    setSelectedDeptIds: (value: number[]) => void
}

export default async function DepartmentCombobox({selectedDeptIds, setSelectedDeptIds} : DepartmentComboboxProps) {
    'use cache'
    const departments = await fetchDepartments()
    const handleValueChange = (value: Department[]) => {
        const deptIds = value.map(item => item.departmentId)
        setSelectedDeptIds(deptIds)
    }

    return (
    <Combobox
      items={departments}
      multiple
      value={departments.filter((item) => selectedDeptIds.includes(item.departmentId))}
      onValueChange={handleValueChange}
    >
      <ComboboxChips>
        <ComboboxValue>
          {(values) => (
            <>
              {values.map((value: Department) => (
                <ComboboxChip key={value.departmentId}>{value.displayName}</ComboboxChip>
              ))}
              <ComboboxChipsInput />
            </>
          )}
        </ComboboxValue>
        <ComboboxChipsInput placeholder="Choose departments" />
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