import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from './auth';

export const FinanceContext = createContext({});

export function FinanceProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [balance, setBalance] = useState({ saldo: 0, receita: 0, despesa: 0 });
  const [movements, setMovements] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const formatDateForAPI = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchFinanceData = async () => {
    if (!user) return;
    
    setLoading(true);
    const formattedDate = formatDateForAPI(selectedDate);
    
    try {
      const [balanceRes, movementsRes] = await Promise.all([
        api.get('/balance', { params: { date: formattedDate } }),
        api.get('/receives', { params: { date: formattedDate } })
      ]);
      
      setBalance({
        saldo: parseFloat(balanceRes.data.saldo) || 0,
        receita: parseFloat(balanceRes.data.receita) || 0,
        despesa: parseFloat(balanceRes.data.despesa) || 0
      });
      
      setMovements(movementsRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMovement = (newMovement) => {
    // Atualiza saldos
    const newBalance = { ...balance };
    const value = parseFloat(newMovement.value);
    
    if (newMovement.type === 'receita') {
      newBalance.saldo += value;
      newBalance.receita += value;
    } else {
      newBalance.saldo -= value;
      newBalance.despesa += value;
    }
    
    setBalance(newBalance);
    
    // Adiciona no início da lista
    setMovements(prev => [newMovement, ...prev]);
  };

  const removeMovement = (movementId, movementValue, movementType) => {
    const value = parseFloat(movementValue);
    const newBalance = { ...balance };
    
    if (movementType === 'receita') {
      newBalance.saldo -= value;
      newBalance.receita -= value;
    } else {
      newBalance.saldo += value;
      newBalance.despesa -= value;
    }
    
    setBalance(newBalance);
    setMovements(prev => prev.filter(item => item.id !== movementId));
  };

  useEffect(() => {
    if (user) {
      fetchFinanceData();
    }
  }, [user, selectedDate]);

  return (
    <FinanceContext.Provider
      value={{
        balance,
        movements,
        selectedDate,
        setSelectedDate,
        loading,
        fetchFinanceData,
        addMovement,
        removeMovement
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}