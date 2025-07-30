import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MONTHS, generateYears } from "@/types/resume";

interface DatePickerProps {
  startMonth?: number;
  startYear?: number;
  endMonth?: number;
  endYear?: number;
  isPresent?: boolean;
  onStartDateChange: (month: number, year: number) => void;
  onEndDateChange: (month: number | null, year: number | null, isPresent: boolean) => void;
  className?: string;
}

export default function DatePicker({
  startMonth,
  startYear,
  endMonth,
  endYear,
  isPresent = false,
  onStartDateChange,
  onEndDateChange,
  className = "",
}: DatePickerProps) {
  const years = generateYears();

  const handleStartMonthChange = (month: string) => {
    const monthNum = parseInt(month);
    if (startYear) {
      onStartDateChange(monthNum, startYear);
    }
  };

  const handleStartYearChange = (year: string) => {
    const yearNum = parseInt(year);
    if (startMonth) {
      onStartDateChange(startMonth, yearNum);
    }
  };

  const handleEndMonthChange = (month: string) => {
    if (month === "present") {
      onEndDateChange(null, null, true);
    } else {
      const monthNum = parseInt(month);
      if (endYear) {
        onEndDateChange(monthNum, endYear, false);
      }
    }
  };

  const handleEndYearChange = (year: string) => {
    const yearNum = parseInt(year);
    if (endMonth && !isPresent) {
      onEndDateChange(endMonth, yearNum, false);
    }
  };

  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      {/* Start Date */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Start Date</label>
        <div className="grid grid-cols-2 gap-2">
          <Select value={startMonth?.toString()} onValueChange={handleStartMonthChange}>
            <SelectTrigger className="form-select text-sm">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="bg-card-dark border-gold-primary/20">
              {MONTHS.map((month) => (
                <SelectItem 
                  key={month.value} 
                  value={month.value.toString()}
                  className="text-gray-300 hover:text-gold-primary hover:bg-gold-primary/10"
                >
                  {month.label.slice(0, 3)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={startYear?.toString()} onValueChange={handleStartYearChange}>
            <SelectTrigger className="form-select text-sm">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="bg-card-dark border-gold-primary/20 max-h-48">
              {years.map((year) => (
                <SelectItem 
                  key={year.value} 
                  value={year.value.toString()}
                  className="text-gray-300 hover:text-gold-primary hover:bg-gold-primary/10"
                >
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* End Date */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">End Date</label>
        <div className="grid grid-cols-2 gap-2">
          <Select 
            value={isPresent ? "present" : endMonth?.toString()} 
            onValueChange={handleEndMonthChange}
          >
            <SelectTrigger className="form-select text-sm">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="bg-card-dark border-gold-primary/20">
              <SelectItem 
                value="present" 
                className="text-gold-primary hover:text-light-yellow hover:bg-gold-primary/10"
              >
                Present
              </SelectItem>
              {MONTHS.map((month) => (
                <SelectItem 
                  key={month.value} 
                  value={month.value.toString()}
                  className="text-gray-300 hover:text-gold-primary hover:bg-gold-primary/10"
                >
                  {month.label.slice(0, 3)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={isPresent ? "" : endYear?.toString()} 
            onValueChange={handleEndYearChange}
            disabled={isPresent}
          >
            <SelectTrigger className={`form-select text-sm ${isPresent ? 'opacity-50' : ''}`}>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="bg-card-dark border-gold-primary/20 max-h-48">
              {years.map((year) => (
                <SelectItem 
                  key={year.value} 
                  value={year.value.toString()}
                  className="text-gray-300 hover:text-gold-primary hover:bg-gold-primary/10"
                >
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
